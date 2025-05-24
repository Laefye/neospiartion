using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;

namespace ArtSite.Utils;

public class DtoConvertor
{
    private readonly ILikeService _likeService;

    public DtoConvertor(ILikeService likeService)
    {
        _likeService = likeService;
    }

    public async Task<FullArtDto> GetFullArtDto(string? userId, Art art)
    {
        var fullArt = new FullArtDto
        {
            Id = art.Id,
            Description = art.Description,
            ProfileId = art.ProfileId,
            UploadedAt = art.UploadedAt,
            TierId = art.TierId,
            IsLiked = userId != null ? await _likeService.IsArtLikedAsync(userId, art.Id) : null,
            LikeCount = await _likeService.GetLikeCountAsync(art.Id),
            CommentCount = -1, // Comment count will be set later
        };
        return fullArt;
    }
}
