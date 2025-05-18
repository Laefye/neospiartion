using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ProfileService : IProfileService
{
    private readonly IArtRepository _artRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IStorageService _storageService;

    public ProfileService(IProfileRepository profileRepository, IArtRepository artRepository, IStorageService storageService)
    {
        _artRepository = artRepository;
        _profileRepository = profileRepository;
        _storageService = storageService;
    }

    public async Task DeleteAvatar(string userId, int profileId)
    {
        var profile = await GetProfile(profileId);
        if (profile.UserId != userId)
        {
            throw new ProfileException.NotOwnerProfile();
        }
        if (profile.Avatar == null)
            throw new ProfileException.NotFoundAvatar();
        await _storageService.Apply(this).DeleteFile(userId, profile.Avatar.Value);
        profile.Avatar = null;
        await _profileRepository.UpdateProfile(profile);
    }

    public async Task<List<Art>> GetArts(int profileId)
    {
        var profile = await GetProfile(profileId);
        return await _artRepository.GetArts(profile.Id);
    }

    public async Task<IFile> GetAvatar(int profileId)
    {
        var profile = await GetProfile(profileId);
        if (profile.Avatar == null)
            throw new ProfileException.NotFoundAvatar();
        var avatar = await _storageService.Apply(this).OpenFile(profile.Avatar.Value);
        return avatar;
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

    public async Task UpdateAvatar(string userId, int profileId, IFileUploader fileUploader)
    {
        var profile = await GetProfile(profileId);
        if (profile.UserId != userId)
        {
            throw new ProfileException.NotOwnerProfile();
        }
        if (profile.Avatar != null)
        {
            await DeleteAvatar(userId, profileId);
        }
        var avatar = await _storageService.Apply(this).UploadFile(userId, fileUploader);
        profile.Avatar = avatar.Id;
        await _profileRepository.UpdateProfile(profile);
    }

    public async Task<Profile> UpdateProfile(string userId, int profileId, string displayName, string description)
    {
        Profile profile = await GetProfile(profileId);
        if (profile.UserId != userId)
        {
            throw new ProfileException.NotOwnerProfile();
        }
        profile.DisplayName = displayName;
        profile.Description = description;
        await _profileRepository.UpdateProfile(profile);
        return profile;
    }
}
