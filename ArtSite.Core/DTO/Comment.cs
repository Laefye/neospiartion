namespace ArtSite.Core.DTO;

public class Comment
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public int ArtId { get; set; }
    public required string Text { get; set; }
    public DateTime UploadedAt { get; init; }
}

