using ArtSite.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/comments")]
[ApiController]
public class CommentController : ControllerBase
{
    [HttpGet("{commentId}")]
    [ProducesResponseType(typeof(Comment), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetComment(int commentId)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{commentId}")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteComment(int commentId)
    {
        throw new NotImplementedException();
    }
}

