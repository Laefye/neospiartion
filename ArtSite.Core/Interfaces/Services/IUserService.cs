using System.Security.Claims;
using ArtSite.Core.DTO;
using Microsoft.AspNetCore.Identity;

namespace ArtSite.Core.Interfaces.Services;

public interface IUserService
{
    Task<IdentityUser> CreateUser(string username, string displayName, string email, string password);
    
    Task<Token> Login(string email, string password);
    
    Task<Profile> FindProfile(string userId);
    
    Task<Profile?> GetProfile(int profileId);

    Task<IdentityUser> GetUser(string userId);

    Task<IdentityUser> GetUserByClaims(ClaimsPrincipal claims);
    
    Task<Profile> GetProfileByClaims(ClaimsPrincipal claims);

    Task<Profile?> GetPossibleProfile(ClaimsPrincipal claims);
}