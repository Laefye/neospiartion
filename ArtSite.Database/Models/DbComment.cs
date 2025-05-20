using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbComment
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public DateTime UploadedAt { get; set; }
    public int ArtId { get; set; }
    public int ProfileId { get; set; }
    
    public Comment ConvertToDto() => new()
    {
        Id = Id,
        Text = Text,
        UploadedAt = UploadedAt,
        ArtId = ArtId,
        ProfileId = ProfileId,
    };
}