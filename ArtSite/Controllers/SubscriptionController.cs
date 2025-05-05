using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ArtSite.Controllers;

[Route("api/subscriptions")]
[ApiController]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpGet("{subscriptionId}")]
    [Authorize]
    [ProducesResponseType(typeof(Subscription), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> GetSubscription(int subscriptionId)
    {
        try
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _subscriptionService.GetSubscription(userId, subscriptionId));
        }
        catch (SubscriptionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<Subscription>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> GetSubscriptions()
    {
        try
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _subscriptionService.GetSubscriptions(userId));
        }
        catch (Exception)
        {
            throw;
        }
    }
}
