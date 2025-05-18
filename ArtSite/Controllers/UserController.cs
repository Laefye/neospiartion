using ArtSite.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Controllers;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IProfileService _profileService;

    public UserController(IUserService userService, IProfileService profileService)
    {
        _userService = userService;
        _profileService = profileService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(SafeUserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Register([FromBody] RegisterDto register)
    {
        try
        {
            var user = await _userService.CreateUser(register.UserName, register.DisplayName, register.Email, register.Password);
            return CreatedAtAction(nameof(GetMe), null, new SafeUserDto
            {
                Id =  user.Id,
                UserName = user.UserName,
                Email = user.Email,
            });
        }
        catch (UserException.FormErrorException e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
                Extensions = new Dictionary<string, object?>
                {
                    { "errors", e.Errors.Select(e => e.Description).ToList() }
                }
            });
        }
        catch (UserException e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpPost("authentication")]
    [ProducesResponseType(typeof(Token), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Login([FromBody] LoginDto model)
    {
        try
        {
            var token = await _userService.Login(model.Email, model.Password);
            return Ok(token);
        }
        catch (UserException e)
        {
            if (e is { ErrorType: UserException.UserError.InvalidCredentials })
            {
                return Unauthorized(new ProblemDetails
                {
                    Detail = "Invalid email or password",
                });
            }
            return BadRequest(new ProblemDetails
            { 
                Detail = e.Message,
            });
        }
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(MeDto), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetMe()
    {
        IdentityUser user;
        try
        {
           user = await _userService.GetUserByClaims(User);
        }
        catch (UserException e)
        {
           return BadRequest(new ProblemDetails
           {
               Detail = e.Message,
           });
        }
        Profile profile = await _profileService.GetProfileByUserId(user.Id);
        return Ok(new MeDto()
        {
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            ProfileId = profile.Id,
        });
    }

    [HttpPut("{userId}")]
    public async Task<ActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUser)
    {
        try
        {
            await _userService.UpdateUser(userId, updateUser.UserName);
            return Accepted();
        }
        catch (UserException e)
        {
            if (e is { ErrorType: UserException.UserError.FieldError, Errors: not null })
            {
                return BadRequest(new ProblemDetails
                {
                    Detail = e.Errors.First().Description
                });
            }
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }
}

