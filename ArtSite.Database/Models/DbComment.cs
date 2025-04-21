using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

class DbComment
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ArtId { get; set; }
    public int ProfileID { get; set; }
    public Comment ConvertToDTO() => new Comment
    {
        Id = Id,
        Content = Content,
        UploadedAt = CreatedAt,
        ArtId = ArtId,
        Profile = new Profile
        {
            Id = ProfileID,
            Name = "Default Profile Name"
        }
    };
}