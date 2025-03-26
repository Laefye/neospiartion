using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("/api/arts")]
[ApiController]
public class ArtController : ControllerBase
{
    private readonly IArtService _artService;

    public ArtController(IArtService artService)
    {
        _artService = artService;
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
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddPictureToArt(int artId, [FromBody] AddingPicture addingPicture)
    {
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        if (addingPicture.Url == null)
            return BadRequest();
        await _artService.AddPictureToArt(artId, addingPicture.Url);
        return Created();
    }

    public class AddingPicture
    {
        public required string Url { get; set; }
    }
}

