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

    public ArtistController(IArtistService artistService, IUserService userService, IArtService artService)
    {
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

    //[Authorize(Policy = "Artist")]
    [HttpGet("{artistId}/arts")]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    //[ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status401Unauthorized)]
    //[ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArts(int profileId)
    {
        //if (await _artistService.GetArtist(artistId) == null)
        //return NotFound();
        //var arts = await _artistService.GetArts(artistId);
        //return Ok(arts);
        // TODO: Исправить ошибку
        throw new NotImplementedException();
    }

    [Authorize(Policy = "Artist")]
    [HttpPost("{artistId}/arts")]
    [ProducesResponseType(typeof(Art), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostArt(int artistId, [FromBody] ArtDto body)
    {
        var profile = await _userService.GetProfileByClaims(User);
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist?.Id != artistId)
        {
            return Unauthorized();
        }
        var art = await _artService.CreateArt(artistId, body.Description);
        return CreatedAtAction(nameof(ArtController.GetArt), "Art", new { artId = art.Id }, art);
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
        throw new NotImplementedException();
    }

    [HttpPost("{artistId}/tiers")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateTier(int artistId, [FromBody] AddingTier addingTier)
    {
        throw new NotImplementedException();
    }

    public class AddingTier
    {
        public int? Extends { get; set; }
        public required string Name { get; set; }
    }
}