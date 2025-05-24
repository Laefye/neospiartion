using System;
using ArtSite.Core.DTO;

namespace ArtSite.DTO;

public class FullArtDto : Art
{
    public bool? IsLiked { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
}
