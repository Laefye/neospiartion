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

    [HttpGet("{artistId}/arts")]
    public async Task<ActionResult<List<Art>>> GetArts(int artistId)
    {
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

        return result;
    }

    public class Art
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required List<string> Pictures { get; set; }
    }
}