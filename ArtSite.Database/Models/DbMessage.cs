using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbMessage
{
    public int Id { get; init; }
    public required string Text { get; set; }
    public int? CommissionId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public Message ConvertToDto() => new()
    {
        Id = Id,
        Text = Text,
        CommissionId = CommissionId,
        SenderId = SenderId,
        ReceiverId = ReceiverId,
        CreatedAt = CreatedAt
    };
}