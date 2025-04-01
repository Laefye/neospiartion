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
    public async Task<ActionResult> CreateArtist([FromBody] string name)
    {
        var artist = await _artistService.CreateArtist(name);
        return Ok(artist.Id);
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
        return Ok(arts);
    }

    [HttpGet("{artistId}/messages")]
    [ProducesResponseType(typeof(IEnumerable<Message>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetMessages(int artistId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{artistId}/messages")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> PostMessage(int artistId, [FromBody] AddingMessage addingMessage)
    {
        throw new NotImplementedException();
    }

    public class AddingMessage
    {
        public required string Text { get; set; }
    }

    [HttpGet("{artistId}/tiers")]
    [ProducesResponseType(typeof(IEnumerable<Tier>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetTiers(int artistId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("{artistId}/tiers")]
    [ProducesResponseType(typeof(Message), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CreateTier(int artistId, [FromBody] AddingTier addingTier)
    {
        throw new NotImplementedException();
    }

    public class AddingTier
    {
        public int? Extends { get; set; }
        public required string Name { get; set; }
    }
}