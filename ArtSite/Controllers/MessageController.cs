using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/messages")]
[ApiController]
public class MessageController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IProfileService _profileService;
    
    public MessageController(IMessageService messageService, IProfileService profileService)
    {
        _messageService = messageService;
        _profileService = profileService;
    }

    [HttpGet("{messageId}")]
    [Authorize]
    [ProducesResponseType(typeof(Message), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessage(int messageId)
    {
        try {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var message = await _messageService.GetMessage(userId, messageId);
            return Ok(message);
        }
        catch (MessageException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }
}

