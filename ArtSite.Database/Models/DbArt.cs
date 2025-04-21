using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbArt
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; }
    public int ArtistId { get; set; }

    public Art ConvertToDto() => new()
    {
        Id = Id,
        Description = Description,
        UploadedAt = UploadedAt,
        ArtistId = ArtistId,
    };
}