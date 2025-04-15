using ArtSite.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/tiers")]
[ApiController]
public class TierController : ControllerBase
{

    [HttpGet("{tierId}")]
    [ProducesResponseType(typeof(Tier), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetTier(int tierId)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{tierId}")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> DeleteTier(int tierId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{tierId}/subscriptions")]

}

