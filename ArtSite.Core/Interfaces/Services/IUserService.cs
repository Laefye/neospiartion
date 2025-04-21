using System.Security.Claims;
using ArtSite.Core.DTO;
using Microsoft.AspNetCore.Identity;

namespace ArtSite.Core.Interfaces.Services;

public interface IUserService
{
    Task<IdentityUser> CreateUser(string email, string password);
    
    Task<Token> Login(string email, string password);
    
    Task<Profile> GetProfile(string userId);
    
    Task<IdentityUser> GetUser(string userId);

    Task<IdentityUser> GetUserByClaims(ClaimsPrincipal claims);
}