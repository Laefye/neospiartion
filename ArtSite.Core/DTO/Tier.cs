using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Tier
{
    public int Id { get; set; }
    public int ArtistId { get; set; }
    public required string Name { get; set; }
    public int Extends { get; set; }
}

