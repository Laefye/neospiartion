using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Message
{
    public int Id { get; set; }
    public int FromProfileId { get; set; }
    public int ToProfileId { get; set; }
    public required string Text { get; set; }
}

