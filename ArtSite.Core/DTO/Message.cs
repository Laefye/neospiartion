using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Message
{
    public Message() { }
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public Message(int id, string content, DateTime sentAt, int senderId, int receiverId)
    {
        Id = id;
        Content = content;
        SentAt = sentAt;
        SenderId = senderId;
        ReceiverId = receiverId;
    }

}
