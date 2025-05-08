using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/profiles")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly IArtService _artService;
    private readonly ITierService _tierService;

    public ProfileController(IProfileService artistService, IArtService artService, ITierService tierService)
    {
        _tierService = tierService;
        _artService = artService;
        _profileService = artistService;
    }

    [HttpGet("{profileId}")]
    [ProducesResponseType(typeof(Profile), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetProfile(int profileId)
    {
        try {
            var profile = await _profileService.GetProfile(profileId);
            return Ok(profile);
        }
        catch (ProfileException.NotFoundProfile e)
        {
            return NotFound(new ProblemDetails {
                Detail = e.Message,
            });
        }
    }

    [HttpPut("{profileId}")]
    [Authorize()]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateProfile(int profileId, [FromBody] UpdateProfileDto updateDto)
    {
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (updateDto == null || string.IsNullOrEmpty(updateDto.DisplayName))
        {
            return BadRequest("DisplayName are required.");
        }
        try
        {
            await _profileService.UpdateProfile(userId, profileId, updateDto.DisplayName);
            return Accepted();
        }
        catch (ProfileException.NotFoundProfile e)
        {
            return NotFound(new ProblemDetails {
                Detail = e.Message,
            });
        }
        catch (ProfileException.NotOwnerProfile e)
        {
            return BadRequest(new ProblemDetails {
                Detail = e.Message,
            });
        }
    }

    [HttpGet("{profileId}/arts")]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArts(int profileId)
    {
        try {
            var arts = await _profileService.GetArts(profileId);
            return Ok(arts);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [Authorize]
    [HttpPost("{profileId}/arts")]
    [ProducesResponseType(typeof(Art), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostArt(int profileId, [FromBody] ArtDto body)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var art = await _artService.Apply(_tierService).CreateArt(userId, profileId, body.Description, body.TierId);
            return CreatedAtAction(nameof(ArtController.GetArt), "Art", new { artId = art.Id }, art);
        } catch (ArtException.UnauthorizedArtistAccess) {
            return Forbid();
        } catch (TierException.NotFoundTier e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (TierException.NotOwnerTier) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{profileId}/messages")]
    [ProducesResponseType(typeof(IEnumerable<Message>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessages(int profileId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{profileId}/messages")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostMessage(int profileId, [FromBody] AddingMessage addingMessage)
    {
        throw new NotImplementedException();
    }

    public class AddingMessage
    {
        public required string Text { get; set; }
    }

    [HttpGet("{profileId}/tiers")]
    [ProducesResponseType(typeof(IEnumerable<Tier>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetTiers(int profileId)
    {
        try {
            var tiers = await _tierService.GetTiers(profileId);
            return Ok(tiers);
        } catch (ProfileException.NotFoundProfile e) { // Но пока что она в любом случае не пойдет в Exception
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{profileId}/tiers")]
    [Authorize]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateTier(int profileId, [FromBody] AddingTierDto addingTier)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var tier = await _tierService.CreateTier(userId, addingTier.Name, addingTier.Description, profileId, addingTier.Price, addingTier.Extends);
            return CreatedAtAction(nameof(TierController.GetTier), "Tier", new { tierId = tier.Id }, tier);
        } catch (ProfileException.NotFoundProfile e) {
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
}
