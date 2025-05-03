using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
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
        var picture = await _artService.GetPicture(pictureId);
        if (picture == null)
        {
            return NotFound();
        }
        HttpContext.Response.Headers.Append("Content-Type", picture.MimeType);
        return Ok(await _storageService.OpenFile(picture.Url, FileAccess.Read));
    }
}
