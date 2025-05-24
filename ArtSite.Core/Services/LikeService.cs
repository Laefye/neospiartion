using System;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class LikeService : ILikeService
{
    private readonly ILikeRepository _likeRepository;
    private readonly IProfileService _profileService;

    public LikeService(ILikeRepository likeRepository, IProfileService profileService)
    {
        _profileService = profileService;
        _likeRepository = likeRepository;
    }

    public async Task<bool> LikeArtAsync(string userId, int artId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);

        if (await _likeRepository.IsLiked(profile.Id, artId))
            return false;

        await _likeRepository.SetLike(profile.Id, artId);
        return true;
    }

    public async Task<bool> UnlikeArtAsync(string userId, int artId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        if (!await _likeRepository.IsLiked(profile.Id, artId))
            return false;

        await _likeRepository.DeleteLike(profile.Id, artId);
        return true;
    }

    public async Task<bool> IsArtLikedAsync(string userId, int artId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        return await _likeRepository.IsLiked(profile.Id, artId);
    }

    public Task<int> GetLikeCountAsync(int artId)
    {
        return _likeRepository.GetLikes(artId);
    }

    public async Task DeleteAllLikesInArt(int artId)
    {
        await _likeRepository.DeleteAllLikesInArt(artId);
    }
}
