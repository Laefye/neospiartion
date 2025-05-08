using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface IProfileService
{
    Task<List<Art>> GetArts(int profileId);

    Task<Profile> GetProfile(int profileId);

    Task<Profile> GetProfileByUserId(string userId);

    Task<Profile> UpdateProfile(string userId, int profileId, string displayName);
}