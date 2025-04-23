using ArtSite.Config;
using ArtSite.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Controllers;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost()]
    public async Task<ActionResult> Register([FromBody] RegisterDto register)
    {
        try
        {
            var user = await _userService.CreateUser(register.UserName, register.DisplayName, register.Email, register.Password);
            return Created();
        }
        catch (UserException e)
        {
            if (e is { ErrorType: UserException.UserError.FieldError, Errors: not null })
            {
                return BadRequest(e.Errors);
            }
            return BadRequest(e.Message);
        }
    }

    [HttpPost("authorization")]
    [ProducesResponseType(typeof(Token), StatusCodes.Status200OK)]
    public async Task<ActionResult> Login([FromBody] LoginDto model)
    {
        try
        {
            var token = await _userService.Login(model.Email, model.Password);
            return Ok(token);
        }
        catch (UserException e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("me")]
    [ProducesResponseType(typeof(IdentityUser), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetMe()
    {
        IdentityUser user;
        try
        {
           user = await _userService.GetUserByClaims(User);
        }
        catch (UserException e)
        {
           return BadRequest(e.Message);
        }

        return Ok(user);
    }
}

