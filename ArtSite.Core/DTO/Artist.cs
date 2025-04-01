namespace ArtSite.Core.DTO;

public class Artist
{
    public int Id { get; init; }
    // public required string UserId {get; init; }
    public required string Name { get; init; }
    public DateTime CreatedAt { get; init; }
}

