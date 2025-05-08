using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ProfileService : IProfileService
{
    private readonly IArtRepository _artRepository;
    private readonly IProfileRepository _profileRepository;

    public ProfileService(IProfileRepository profileRepository, IArtRepository artRepository)
    {
        _artRepository = artRepository;
        _profileRepository = profileRepository;
    }

    public async Task<List<Art>> GetArts(int profileId)
    {
        var profile = await GetProfile(profileId);
        return await _artRepository.GetArts(profile.Id);
    }

    public async Task<Profile> GetProfile(int profileId)
    {
        var profile = await _profileRepository.GetProfile(profileId);
        if (profile == null)
            throw new ProfileException.NotFoundProfile();
        return profile;
    }

    public async Task<Profile> GetProfileByUserId(string userId)
    {
        var profile = await _profileRepository.GetProfileByUserId(userId);
        if (profile == null)
            throw new ProfileException.NotFoundProfile();
        return profile;
    }

    public async Task<Profile> UpdateProfile(string userId, int profileId, string displayName)
    {
        Profile profile = await GetProfile(profileId);
        if (profile == null || profile.UserId != userId)
        {
            throw new ProfileException.NotOwnerProfile();
        }
        var updatedProfile = new Profile {
            Id = profile.Id,
            DisplayName = displayName,
            UserId = profile.UserId
        };
        await _profileRepository.UpdateProfile(updatedProfile);
        return updatedProfile;
    }
}
