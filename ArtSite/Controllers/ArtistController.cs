using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using ArtSite.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/artists")]
[ApiController]
public class ArtistController : ControllerBase
{
    private readonly IArtistService _artistService;
    private readonly IUserService _userService;
    private readonly IArtService _artService;
    private readonly ITierService _tierService;

    public ArtistController(IArtistService artistService, IUserService userService, IArtService artService, ITierService tierService)
    {
        _tierService = tierService;
        _artistService = artistService;
        _userService = userService;
        _artService = artService;
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(Artist), StatusCodes.Status201Created)]
    public async Task<ActionResult> CreateArtist()
    {
        Artist artist;
        try
        {
            var profile = await _userService.GetProfileByClaims(User);
            artist = await _artistService.CreateArtist(profile.Id);
        }
        catch (UserException ex)
        {
            if (ex is { ErrorType: UserException.UserError.NotFound })
            {
                return Unauthorized();
            }

            return BadRequest(new ProblemDetails
            {
                Detail = ex.Message
            });
        }
        catch (ArtistException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = ex.Message
            });
        }
        return CreatedAtAction(nameof(GetArtist), new { artistId = artist.Id }, artist);
    }

    [HttpGet("{artistId}")]
    [ProducesResponseType(typeof(IEnumerable<Artist>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArtist(int artistId)
    {
        var artist = await _artistService.GetArtist(artistId);
        if (artist == null)
            return NotFound();
        return Ok(artist);
    }

    [HttpGet("{artistId}/arts")]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArts(int artistId)
    {
        if (await _artistService.GetArtist(artistId) == null)
            return NotFound();
        var arts = await _artistService.GetArts(artistId);
        return Ok(arts);
    }

    [Authorize(Policy = "Artist")]
    [HttpPost("{artistId}/arts")]
    [ProducesResponseType(typeof(Art), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostArt(int artistId, [FromBody] ArtDto body)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _artService.CreateArt(userId, artistId, body.Description, body.TierId));
        } catch (ArtException.UnauthorizedArtistAccess) {
            return Forbid();
        } catch (UserException) {
            return Unauthorized();
        }
    }

    [HttpGet("{artistId}/messages")]
    [ProducesResponseType(typeof(IEnumerable<Message>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessages(int artistId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{artistId}/messages")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostMessage(int artistId, [FromBody] AddingMessage addingMessage)
    {
        throw new NotImplementedException();
    }

    public class AddingMessage
    {
        public required string Text { get; set; }
    }

    [HttpGet("{artistId}/tiers")]
    [ProducesResponseType(typeof(IEnumerable<Tier>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetTiers(int artistId)
    {
        try {
            var tiers = await _tierService.GetTiers(artistId);
            return Ok(tiers);
        } catch (ArtistException.NotFoundArtist e) { // Но пока что она в любом случае не пойдет в Exception
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{artistId}/tiers")]
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateTier(int artistId, [FromBody] AddingTier addingTier)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var tier = await _tierService.CreateTier(userId, addingTier.Name, addingTier.Description, artistId, addingTier.Price, addingTier.Extends);
            return CreatedAtAction(nameof(GetTiers), new { artistId }, tier);
        } catch (ArtistException.NotFoundArtist e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (TierException.NotOwnerTier) {
            return Forbid();
        } catch (TierException.NotFoundTier e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    public class AddingTier
    {
        public int? Extends { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int Price { get; set; }
    }
}