using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Message
{
    public int Id { get; init; }
    public required string Text { get; set; }
    public int? CommissionId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public DateTime CreatedAt { get; set; }
}
