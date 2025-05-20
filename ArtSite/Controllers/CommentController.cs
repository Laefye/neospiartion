using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/comments")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;
    
    public CommentController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("{commentId}")]
    [ProducesResponseType(typeof(Comment), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetComment(int commentId)
    {
        try {
            var comment = await _commentService.GetComment(commentId);
            return Ok(comment);
        } catch (CommentException.NotFoundComment) {
            return NotFound();
        } catch (Exception) {
            throw;
        }
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteComment(int commentId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _commentService.DeleteComment(userId, commentId);
            return Accepted();
        } catch (CommentException.NotOwnerComment) {
            return Forbid();
        } catch (CommentException.NotFoundComment) {
            return NotFound();
        } catch (Exception) {
            throw;
        }
    }
}

