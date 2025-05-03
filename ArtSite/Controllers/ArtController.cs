using System.IO;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("/api/arts")]
[ApiController]
public class ArtController : ControllerBase
{
    private readonly IArtService _artService;
    private readonly IStorageService _storageService;

    public ArtController(IArtService artService, IStorageService storageService)
    {
        _artService = artService;
        _storageService = storageService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllArts([FromQuery] int offset = 0, [FromQuery] int limit = 10)
    {
        return Ok(await _artService.GetAllArts(offset, limit));
    }

    [HttpGet("{artId}")]
    [ProducesResponseType(typeof(Art), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArt(int artId)
    {
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        return Ok(art);
    }

    [HttpDelete("{artId}")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteArt(int artId)
    {
        throw new NotImplementedException();
    }


    [HttpGet("{artId}/pictures")]
    [ProducesResponseType(typeof(IEnumerable<Picture>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetPicturesByArt(int artId)
    {
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        var pictures = await _artService.GetPicturesByArt(artId);
        return Ok(pictures);
    }

    [HttpPost("{artId}/pictures")]
    [ProducesResponseType(typeof(Picture), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddPictureToArt(int artId, IFormFile file)
    {
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        var uri = await _storageService.CreateFile();
        using (var stream = await _storageService.OpenFile(uri, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }
        await _artService.AddPictureToArt(artId, uri, file.ContentType);
        return Created();
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

