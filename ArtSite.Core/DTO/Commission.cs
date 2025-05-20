using System;

namespace ArtSite.Core.DTO;

public class Commission
{
    public int Id { get; init; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int ProfileId { get; set; }
    public int? Image { get; set; }
    public int Price { get; set; }
    public DateTime CreatedAt { get; set; }
}
