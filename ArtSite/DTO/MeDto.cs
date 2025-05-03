namespace ArtSite.DTO;

public class MeDto
{
    public required string UserId { get; init; }
    public required string Email { get; init; }
    public int ProfileId { get; init; }
    public int? ArtistId { get; init; }
}
