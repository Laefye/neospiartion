using ArtSite.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/messages")]
[ApiController]
public class MessageController : ControllerBase
{
    [HttpGet()]
    [ProducesResponseType(typeof(Message), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetMessages([FromQuery] bool onlyLast = false)
    {
        throw new NotImplementedException();
    }

    [HttpGet("{messageId}")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessage(int messageId)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{messageId}")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteMessage(int messageId)
    {
        throw new NotImplementedException();
    }
}

