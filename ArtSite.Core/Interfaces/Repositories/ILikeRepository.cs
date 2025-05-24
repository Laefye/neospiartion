using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ILikeRepository
{
    Task<int> GetLikes(int artId);

    Task SetLike(int profileId, int artId);

    Task DeleteLike(int profileId, int artId);

    Task<bool> IsLiked(int profile, int artId);
}
