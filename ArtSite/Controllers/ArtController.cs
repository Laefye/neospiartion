using System.IO;
using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using ArtSite.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("/api/arts")]
[ApiController]
public class ArtController : ControllerBase
{
    private readonly IArtService _artService;
    private readonly IProfileService _profileService;
    private readonly ICommentService _commentService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly ILikeService _likeService;
    private readonly DtoConvertor _dtoConvertor;

    public ArtController(IArtService artService, IProfileService profileService, ICommentService commentService, ISubscriptionService subscriptionService, ILikeService likeService)
    {
        _artService = artService;
        _profileService = profileService;
        _commentService = commentService;
        _subscriptionService = subscriptionService;
        _likeService = likeService;
        _dtoConvertor = new DtoConvertor(likeService, commentService);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Countable<FullArtDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllArts([FromQuery] int offset = 0, [FromQuery] int limit = 10)
    {
        try {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var arts = await _artService.GetAllArts(userId, offset, limit);
            var fullArts = new List<FullArtDto>();
            foreach (var art in arts.Items)
            {
                var fullArt = await _dtoConvertor.GetFullArtDto(userId, art);
                fullArts.Add(fullArt);
            }
            return Ok(new Countable<FullArtDto>
            {
                Items = fullArts,
                Count = arts.Count
            });
        } catch (Exception) {
            throw;
        }
    }

    
    [HttpGet("{artId}")]
    [ProducesResponseType(typeof(FullArtDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArt(int artId)
    {
        try {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _dtoConvertor.GetFullArtDto(userId, await _artService.GetArt(userId, artId)));
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpDelete("{artId}")]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteArt(int artId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _artService.Apply(_commentService).Apply(_likeService).DeleteArt(userId, artId);
            return Accepted();
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (ArtException.UnauthorizedArtistAccess) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }


    [HttpGet("{artId}/pictures")]
    [ProducesResponseType(typeof(IEnumerable<Picture>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetPicturesByArt(int artId)
    {
        try {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _artService.Apply(_subscriptionService).GetPictures(userId, artId));
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        }
        catch (ArtException.UnauthorizedArtistAccess)
        {
            return Forbid();
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpPost("{artId}/pictures")]
    [Authorize]
    [ProducesResponseType(typeof(Picture), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddPictureToArt(int artId, IFormFile file)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var picture = await _artService.UploadPicture(userId, artId, new FileUploader(file));
            return CreatedAtAction(nameof(PictureController.GetPicture), "Picture", new { pictureId = picture.Id }, picture);
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (ArtException.UnauthorizedArtistAccess) {
            return Forbid();
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{artId}/comments")]
    [ProducesResponseType(typeof(IEnumerable<Comment>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetComments(int artId, [FromQuery] int offset = 0, [FromQuery] int limit = 10)
    {
        try {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _commentService.GetComments(userId, artId, offset, limit));
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }   
    }

    [HttpPost("{artId}/comments")]
    [Authorize]
    [ProducesResponseType(typeof(Comment), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostComment(int artId, [FromBody] AddingComment comment)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var createdComment = await _commentService.CreateComment(userId, artId, comment.Text);
            return CreatedAtAction(nameof(CommentController.GetComment), "Comment", new { commentId = createdComment.Id }, createdComment);
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{artId}/like")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> LikeArt(int artId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (await _likeService.LikeArtAsync(userId, artId)) {
                return CreatedAtAction(nameof(GetArt), new { artId }, null);
            } else {
                return Forbid();
            }
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpDelete("{artId}/like")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> UnlikeArt(int artId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (await _likeService.UnlikeArtAsync(userId, artId)) {
                return Accepted();
            } else {
                return Forbid();
            }
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }


    public class AddingComment
    {
        public required string Text { get; set; }
    }
}

