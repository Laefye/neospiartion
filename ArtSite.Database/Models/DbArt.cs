using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbArt
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; }
    public int ArtistId { get; set; }

    public List<DbPicture> Pictures { get; set; } = new();


    public Art ConvertToDto() => new()
    {
        Id = Id,
        Description = Description,
        UploadedAt = UploadedAt,
        ArtistId = ArtistId,
    };
}