namespace ArtSite.Core.DTO;

public class Token
{
    public required string AccessToken { get; init; }
    public DateTime ExpiresAt { get; init; }
}