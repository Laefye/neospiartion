using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IProfileRepository
{
    Task<Profile?> GetProfile(int id);
    Task<Profile?> GetProfileByUserId(string userId);
    Task<Profile> CreateProfile(string userId, string displayName);
    Task UpdateProfile(Profile profile);
    Task DeleteProfile(int id);
    Task<IEnumerable<Profile>> SearchProfilesByDisplayName(string query);
}