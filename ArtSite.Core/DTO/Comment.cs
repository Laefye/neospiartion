namespace ArtSite.Core.DTO;

public class Comment
{
    public int Id { get; set; }
    public required string Content { get; init; }
    public required Profile Profile { get; init; }
    public int ArtId { get; set; }
    public DateTime UploadedAt { get; init; }
}

