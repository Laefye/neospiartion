using System;
using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbCommission
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int ProfileId { get; set; }
    public int? Image { get; set; }
    public int Price { get; set; }
    public DateTime CreatedAt { get; set; }

    public Commission ConvertToDto() => new Commission
    {
        Id = Id,
        Name = Name,
        Description = Description,
        ProfileId = ProfileId,
        Image = Image,
        Price = Price,
        CreatedAt = CreatedAt
    };
}
