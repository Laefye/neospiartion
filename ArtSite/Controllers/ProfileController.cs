using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;

[Route("api/profiles")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IArtistService _artistService;

    public ProfileController(IUserService userService, IArtistService artistService)
    {
        _userService = userService;
        _artistService = artistService;
    }

    [HttpGet("{profileId}")]
    [ProducesResponseType(typeof(Profile), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetProfile(int profileId)
    {
        var profile = await _userService.GetProfile(profileId);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }

    [HttpGet("{profileId}/artist")]
    [ProducesResponseType(typeof(Artist), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetArtist(int profileId)
    {
        var profile = await _userService.GetProfile(profileId);
        if (profile == null)
        {
            return NotFound();
        }
        var artist = await _artistService.GetArtistByProfileId(profileId);
        if (artist == null)
        {
            return NotFound();
        }
        return Ok(artist);
    }

    [HttpPut("{profileId}")]
    [Authorize()]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateProfile(int profileId, [FromBody] UpdateProfileDto updateDto)
    {
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (updateDto == null || string.IsNullOrEmpty(updateDto.DisplayName) || string.IsNullOrEmpty(updateDto.UserName))
        {
            return BadRequest("DisplayName and UserName are required.");
        }
        await _userService.UpdateProfile(userId, profileId, updateDto.DisplayName, updateDto.UserName);

        return Accepted();
    }

}
