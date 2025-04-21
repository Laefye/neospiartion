using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbMessage
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public DateTime SentAt { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public Message ConvertToDto() => new()
    {
        Id = Id,
        Text = Text,
        SentAt = SentAt,
        SenderId = SenderId,
        ReceiverId = ReceiverId,
    };
}