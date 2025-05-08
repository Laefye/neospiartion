using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Tier
{
    public int Id { get; init; }
    public int ProfileId { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int Price { get; init; }
    public int? Extends { get; init; }
}

