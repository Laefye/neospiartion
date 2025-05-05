using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/tiers")]
[ApiController]
public class TierController : ControllerBase
{
    private readonly ITierService _tierService;
    private readonly ISubscriptionService _subscriptionService;

    public TierController(ITierService tierService, ISubscriptionService subscriptionService)
    {
        _tierService = tierService;
        _subscriptionService = subscriptionService;
    }

    [HttpGet("{tierId}")]
    [ProducesResponseType(typeof(Tier), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetTier(int tierId)
    {
        try
        {
            var tier = await _tierService.GetTier(tierId);
            return Ok(tier);
        }
        catch (TierException.NotFoundTier e)
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

    [HttpDelete("{tierId}")]
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> DeleteTier(int tierId)
    {
        try
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _tierService.DeleteTier(userId, tierId);
            return Accepted();
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
        catch (Exception)
        {
            throw;
        }
    }

    [HttpPost("{tierId}/subscriptions")]
    [Authorize]
    [ProducesResponseType(typeof(Subscription), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> SubscribeToTier(int tierId)
    {
        try
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var subscription = await _subscriptionService.Subscribe(userId, tierId);
            return CreatedAtAction(nameof(SubscriptionController.GetSubscription), "Subscription", new { subscriptionId = subscription.Id }, subscription);
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
        catch (SubscriptionException.ItsYou e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (SubscriptionException.AlreadySubscribed e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (Exception)
        {
            throw;
        }
    }
}

