using System;
using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbStoragedFile
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public required string MimeType { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required string Url { get; set; }

    public StoragedFile ConvertToDto() => new()
    {
        Id = Id,
        ProfileId = ProfileId,
        MimeType = MimeType,
        CreatedAt = CreatedAt,
        Url = Url,
    };
}
