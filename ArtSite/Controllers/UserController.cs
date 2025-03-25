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

namespace ArtSite.Controllers;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly JwtConfig _jwtConfig;

    public UserController(UserManager<IdentityUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _jwtConfig = new(configuration);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDto register)
    {
        var userExists = await _userManager.FindByEmailAsync(register.Email);
        if (userExists != null)
            return BadRequest("Пользователь с таким email уже существует");

        var user = new IdentityUser()
        {
            Email = register.Email,
            UserName = register.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(user, register.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);
        return Ok("Пользователь создан успешно");
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized();

        var authClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
        };

        var token = GetToken(authClaims);

        return Ok(new JwtSecurityTokenHandler().WriteToken(token));
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("me")]
    public async Task<ActionResult> GetMe()
    {
       var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User ID not found in claims");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found in database");

        return Ok(new
        {
            UserId = userId,
            Email = user.Email,
        });
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            expires: DateTime.Now.AddDays(7),
            claims: authClaims,
            signingCredentials: new SigningCredentials(_jwtConfig.SymmetricSecurityKey, SecurityAlgorithms.HmacSha256)
        );
        return token;
    }
}

