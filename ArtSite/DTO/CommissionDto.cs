using System;

namespace ArtSite.DTO;

public class CommissionDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Price { get; set; }
}
