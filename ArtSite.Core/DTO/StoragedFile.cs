using System;

namespace ArtSite.Core.DTO;

public class StoragedFile
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public required string MimeType { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required string Url { get; set; }
}
