using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Message
{
    public int Id { get; init; }
    public required string Text { get; init; }
    public DateTime SentAt { get; init; }
    public int SenderId { get; init; }
    public int ReceiverId { get; init; }
}
