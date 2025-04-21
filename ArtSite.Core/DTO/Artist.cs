namespace ArtSite.Core.DTO;

public class Artist
{
    public int Id { get; init; }
    public required string ProfileId { get; init; }
    public DateTime CreatedAt { get; init; }
}

