using System;

namespace ArtSite.DTO;

public class AddingTierDto
{
    public int? Extends { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int Price { get; set; }
}
