using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ArtSite.Config;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ArtSite.Core.Services;

public class UserService : IUserService
{
    private readonly JwtConfig _jwtConfig;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IProfileRepository _profileRepository;

    public UserService(
        UserManager<IdentityUser> userManager,
        IProfileRepository profileRepository,
        IConfiguration configuration
    )
    {
        _userManager = userManager;
        _profileRepository = profileRepository;
        _jwtConfig = new JwtConfig(configuration);
    }

    public async Task<IdentityUser> CreateUser(string username, string displayName, string email, string password)
    {
        var existingUserByEmail = await _userManager.FindByEmailAsync(email);
        var existingUserByUsername = await _userManager.FindByNameAsync(username);
        if (existingUserByEmail != null || existingUserByUsername != null)
        {
            throw new UserException(UserException.UserError.AlreadyExists);
        }
        var user = new IdentityUser
        {
            UserName = username,
            Email = email
        };
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new UserException.FormErrorException(result.Errors);
        }
        var profile = await _profileRepository.CreateProfile(user.Id, displayName);
        return user;
    }

    public async Task<Token> Login(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
        {
            throw new UserException(UserException.UserError.InvalidCredentials);
        }

        var token = GenerateJwtToken(user);
        return token;
    }

    private Token GenerateJwtToken(IdentityUser user)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
        };
        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            expires: DateTime.UtcNow.AddDays(7),
            claims: authClaims,
            signingCredentials: new SigningCredentials(_jwtConfig.SymmetricSecurityKey, SecurityAlgorithms.HmacSha256)
        );

        return new Token
        {
            AccessToken = "Bearer " + new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = token.ValidTo,
        };
    }

    public async Task<Profile> FindProfile(string userId)
    {
        var profile = await _profileRepository.GetProfileByUserId(userId);
        if (profile == null)
        {
            throw new UserException(UserException.UserError.NotFound);
        }
        return profile;
    }

    public async Task<IdentityUser> GetUser(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UserException(UserException.UserError.NotFound);
        }

        return user;
    }

    public async Task<IdentityUser> GetUserByClaims(ClaimsPrincipal claims)
    {
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            throw new UserException(UserException.UserError.NotFound);
        }
        return await GetUser(userId);
    }

    public async Task<Profile> GetProfileByClaims(ClaimsPrincipal claims)
    {
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            throw new UserException(UserException.UserError.NotFound);
        }
        return await FindProfile(userId);
    }

    public Task<Profile?> GetProfile(int profileId)
    {
        return _profileRepository.GetProfile(profileId);
    }

    public async Task<Profile?> GetPossibleProfile(ClaimsPrincipal claims)
    {
        try
        {
            return await GetProfileByClaims(claims);
        }
        catch (UserException)
        {
            return null;
        }
    }

    public async Task UpdateUser(string userId, string userName)
    {
        IdentityUser? user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UserException.NotAllowedException();
        }
        user.UserName = userName;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new UserException(UserException.UserError.FieldError, result.Errors);
        }
    }
}