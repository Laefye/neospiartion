using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbTier
{
    public int Id { get; set; }
    public int ArtistId { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Price { get; set; }
    public int? Extends { get; set; }



    public List<DbSubscription> Subscribers = new();
    
    public Tier ConvertToDto() => new()
    {
        Id = Id,
        Name = Name,
        ArtistId = ArtistId,
        Description = Description,
        Price = Price,
        Extends = Extends,
    };
}