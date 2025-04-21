using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbArtist
{
    public int Id { get; set; }
    public required string ProfileId { get; set; }
    public DateTime CreatedAt { get; set; }

    public Artist ConvertToDTO() => new Artist
    {
        Id = Id,
        Profile = new Profile
        {
            Id = int.Parse(ProfileId),
            Name = string.Empty,
            Comments = new List<Comment>(),
            Artists = new List<Artist>()
        },
        CreatedAt = CreatedAt
    };
}