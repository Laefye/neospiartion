using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Tier
{
    public int Id { get; init; }
    public int ArtistId { get; init; }
    public required string Name { get; init; }
    public int? Extends { get; init; }
}

