using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbMessage
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public Message ConvertToDTO() => new Message
    {
        Id = Id,
        Content = Content,
        SentAt = SentAt,
        SenderId = SenderId,
        ReceiverId = ReceiverId,
    };
}