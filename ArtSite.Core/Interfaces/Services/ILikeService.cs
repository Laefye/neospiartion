using System;

namespace ArtSite.Core.Interfaces.Services;

public interface ILikeService
{
    Task<bool> LikeArtAsync(string userId, int artId);

    Task<bool> UnlikeArtAsync(string userId, int artId);

    Task<bool> IsArtLikedAsync(string userId, int artId);

    Task<int> GetLikeCountAsync(int artId);

    Task DeleteAllLikesInArt(int artId);
}
