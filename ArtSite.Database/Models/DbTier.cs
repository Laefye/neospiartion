using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbTier
{
    public int Id { get; set; }
    public int ArtistId { get; set; }
    public required string Name { get; set; }
    public int? Extends { get; set; }
    
    public Tier ConvertToDto() => new()
    {
        Id = Id,
        Name = Name,
        Extends = Extends,
    };
}