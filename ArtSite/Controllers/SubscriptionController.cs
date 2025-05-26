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

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(Subscription), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UnsubscribeFromTier(int id)
    {
        try
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _subscriptionService.Unsubscribe(userId, id);
            return Ok();
        }
        catch (TierException.NotFoundTier e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        }
        catch (TierException.NotOwnerTier)
        {
            return Forbid();
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
}
