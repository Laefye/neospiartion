using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/subscriptions")]
[ApiController]
public class SubscriptionController : ControllerBase
{
    [HttpGet("{subscriptionId}")]
    public async Task<ActionResult> GetSubscription(int subscriptionId)
    {
        return Ok(1);
    }
}
