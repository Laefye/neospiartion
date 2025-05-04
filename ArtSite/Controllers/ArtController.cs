using System.IO;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
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
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteArt(int artId)
    {
        var profile = await _userService.GetPossibleProfile(User) ?? throw new UnauthorizedAccessException("User not found");
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null)
            return Unauthorized();
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        if (art.ArtistId != artist.Id)
            return Forbid();
        await _artService.DeleteArt(artId);
        return Accepted();
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
    [Authorize(Policy = "Artist")]
    [ProducesResponseType(typeof(Picture), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddPictureToArt(int artId, IFormFile file)
    {
        var profile = await _userService.GetPossibleProfile(User) ?? throw new UnauthorizedAccessException("User not found");
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null)
            return Unauthorized();
        var art = await _artService.GetArt(artId);
        if (art == null)
            return NotFound();
        if (art.ArtistId != artist.Id)
            return Forbid();
        var picture = await _artService.AddPictureToArt(artId, file, file.ContentType);
        return CreatedAtAction(nameof(PictureController.GetPicture), "Picture", new { pictureId = picture.Id }, picture);
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

