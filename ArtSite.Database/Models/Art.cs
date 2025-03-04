namespace ArtSite.Database.Models;

public class Art : ICloneable
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; }
    public int ArtistId { get; set; }

    public object Clone()
    {
        return new Art
        {
            Id = Id,
            Description = Description,
            UploadedAt = UploadedAt,
            ArtistId = ArtistId
        };
    }
}