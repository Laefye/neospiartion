using System.Security.Claims;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/pictures")]
[ApiController]
public class PictureController : ControllerBase
{
    private readonly IArtService _artService;
    private readonly IStorageService _storageService;

    public PictureController(IArtService artService, IStorageService storageService)
    {
        _artService = artService;
        _storageService = storageService;
    }

    [HttpGet("{pictureId}/view")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetPicture(int pictureId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var picture = await _artService.GetPicture(userId, pictureId);
            HttpContext.Response.Headers.Append("Content-Type", picture.MimeType);
            return Ok(await _storageService.OpenFile(picture.Url, FileAccess.Read));
        }
        catch (ArtException.NotFoundPicture e)
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
