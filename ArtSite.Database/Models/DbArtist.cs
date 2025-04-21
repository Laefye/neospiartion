using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbArtist
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public DateTime CreatedAt { get; set; }

    public Artist ConvertToDTO() => new()
    {
        Id = Id,
        ProfileId = ProfileId,
        CreatedAt = CreatedAt
    };
}