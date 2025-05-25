using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;

namespace ArtSite.Utils;

public class DtoConvertor
{
    private readonly ILikeService _likeService;
    private readonly ICommentService _commentService;

    public DtoConvertor(ILikeService likeService, ICommentService commentService)
    {
        _likeService = likeService;
        _commentService = commentService;
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
            CommentCount = await _commentService.GetCommentCount(art.Id),
        };
        return fullArt;
    }
}
