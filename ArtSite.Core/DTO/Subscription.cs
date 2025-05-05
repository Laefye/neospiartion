namespace ArtSite.Core.DTO;

public class Subscription
{
    public int Id { get; set; }
    public required int ProfileId { get; set; }
    public int TierId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

