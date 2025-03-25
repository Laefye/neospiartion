using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/artists")]
[ApiController]
public class ArtistController : ControllerBase
{
    private readonly IArtistService _artistService;

    public ArtistController(IArtistService artistService)
    {
        _artistService = artistService;
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateArtist([FromBody] string name)
    {
        var artist = await _artistService.CreateArtist(name);
        return artist.Id;
    }

    [HttpGet("{artistId}")]
    [ProducesResponseType(typeof(IEnumerable<Artist>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArtist(int artistId)
    {
        var artist = await _artistService.GetArtist(artistId);
        if (artist == null)
            return NotFound();
        return Ok(artist);
    }

    [HttpGet("{artistId}/arts")]
    [ProducesResponseType(typeof(IEnumerable<Art>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArts(int artistId)
    {
        if (await _artistService.GetArtist(artistId) == null)
            return NotFound();
        var arts = await _artistService.GetArts(artistId);
        var result = new List<Art>();
        foreach (var art in arts)
        {
            var pictures = await _artistService.GetPictures(art.Id);
            result.Add(new Art
            {
                Id = art.Id,
                Description = art.Description,
                UploadedAt = art.UploadedAt,
                Pictures = pictures.Select(picture => picture.Url).ToList()
            });
        }
        return Ok(result);
    }

    public class Art
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required List<string> Pictures { get; set; }
    }
}