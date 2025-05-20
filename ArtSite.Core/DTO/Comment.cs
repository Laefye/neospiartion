namespace ArtSite.Core.DTO;

public class Comment
{
    public int Id { get; set; }
    public required string Text { get; init; }
    public int ProfileId { get; init; }
    public int ArtId { get; set; }
    public DateTime UploadedAt { get; init; }
}

