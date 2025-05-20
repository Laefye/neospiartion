using System;

namespace ArtSite.DTO;

public class AddingMessageDto
{
    public required string Text { get; set; }
    public int? CommissionId { get; set; }
}
