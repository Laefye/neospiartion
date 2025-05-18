using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using ArtSite.Utils;
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
    private readonly ISubscriptionService _subscriptionService;
    private readonly ICommissionService _commissionService;
    private readonly IMessageService _messageService;

    public ProfileController(IProfileService artistService, IArtService artService, ITierService tierService, ISubscriptionService subscriptionService, ICommissionService commissionService, IMessageService messageService)
    {
        _profileService = artistService;
        _artService = artService;
        _tierService = tierService;
        _subscriptionService = subscriptionService;
        _commissionService = commissionService;
        _messageService = messageService.Apply(commissionService);
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
            await _profileService.UpdateProfile(userId, profileId, updateDto.DisplayName, updateDto.Description);
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
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<Message>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessages(int profileId, [FromQuery] int limit = 10, [FromQuery] int offset = 0)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var messages = await _messageService.GetMessages(userId, profileId, limit, offset);
            return Ok(messages);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (MessageException.SelfMessage) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{profileId}/messages")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostMessage(int profileId, [FromBody] AddingMessageDto addingMessage)
    {
        if (addingMessage == null || string.IsNullOrEmpty(addingMessage.Text))
        {
            return BadRequest("Text is required.");
        }
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var message = await _messageService.CreateMessage(userId, profileId, addingMessage.Text, addingMessage.CommissionId);
            return CreatedAtAction(nameof(MessageController.GetMessage), "Message", new { messageId = message.Id }, message);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (MessageException.SelfMessage) {
            return Forbid();
        } catch (MessageException.NotFoundCommission e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{profileId}/conversations")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<Conversation>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetConversations(int profileId, [FromQuery] int limit = 10, [FromQuery] int offset = 0)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var conversations = await _messageService.GetConversations(userId, profileId, limit, offset);
            return Ok(conversations);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (MessageException.SelfMessage) {
            return Forbid();
        } catch (MessageException.NotOwner) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
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

    [HttpGet("{profileId}/avatar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetAvatar(int profileId)
    {
        try {
            var avatar = await _profileService.GetAvatar(profileId);
            return File(avatar.Stream, avatar.MimeType);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (ProfileException.NotFoundAvatar e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{profileId}/avatar")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostAvatar(int profileId, IFormFile avatarFile)
    {
        if (avatarFile == null || avatarFile.Length == 0)
        {
            return BadRequest("Avatar file is required.");
        }
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _profileService.UpdateAvatar(userId, profileId, new FileUploader(avatarFile));
            return Accepted();
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (ProfileException.NotOwnerProfile) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpDelete("{profileId}/avatar")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteAvatar(int profileId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _profileService.DeleteAvatar(userId, profileId);
            return Accepted();
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (ProfileException.NotOwnerProfile) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{profileId}/subscriptions")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<Subscription>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetSubscriptions(int profileId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var subscriptions = await _subscriptionService.GetSubscriptions(userId, profileId);
            return Ok(subscriptions);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (SubscriptionException.NotOwned) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{profileId}/commissions")]
    [ProducesResponseType(typeof(IEnumerable<Commission>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetCommissions(int profileId)
    {
        try {
            var commissions = await _commissionService.GetCommissionsByProfileId(profileId);
            return Ok(commissions);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{profileId}/commissions")]
    [Authorize]
    [ProducesResponseType(typeof(Commission), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostCommission(int profileId, [FromBody] CommissionDto commissionDto)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var commission = await _commissionService.CreateCommission(userId, profileId, commissionDto.Name, commissionDto.Description, commissionDto.Price);
            return CreatedAtAction(nameof(CommissionController.GetCommission), "Commission", new { commissionId = commission.Id }, commission);
        } catch (ProfileException.NotFoundProfile e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (CommissionException.NotOwner) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }
}
