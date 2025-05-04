using System.IO;
using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("/api/arts")]
[ApiController]
public class ArtController : ControllerBase
{
    private readonly IArtService _artService;
    private readonly IArtistService _artistService;
    private readonly IStorageService _storageService;
    private readonly IUserService _userService;

    public ArtController(IArtService artService, IStorageService storageService, IArtistService artistService, IUserService userService)
    {
        _artService = artService;
        _storageService = storageService;
        _userService = userService;
        _artistService = artistService;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllArts([FromQuery] int offset = 0, [FromQuery] int limit = 10)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _artService.GetAllArts(userId, offset, limit));
        } catch (Exception) {
            throw;
        }
    }

    [HttpGet("{artId}")]
    [ProducesResponseType(typeof(Art), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArt(int artId)
    {
        try {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _artService.GetArt(userId, artId));
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
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteArt(int artId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _artService.DeleteArt(userId, artId);
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
            return Ok(await _artService.GetPictures(userId, artId));
        } catch (ArtException.NotFoundArt e) {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message
            });
        } catch (Exception) {
            throw;
        }
    }

    [HttpPost("{artId}/pictures")]
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(typeof(Picture), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddPictureToArt(int artId, IFormFile file)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var picture = await _artService.UploadPicture(userId, artId, new PictureUploader(file));
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
    [ProducesResponseType(typeof(Comment), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetComments(int artId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{artId}/comments")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostComment(int artId, [FromBody] AddingComment comment)
    {
        throw new NotImplementedException();
    }

    public class AddingComment
    {
        public required string Text { get; set; }
    }
}

