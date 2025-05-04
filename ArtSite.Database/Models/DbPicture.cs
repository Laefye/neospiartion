using ArtSite.Core.DTO;
using System.Xml.Linq;

namespace ArtSite.Database.Models;

public class DbPicture
{
    public int Id { get; set; }
    public required int ArtId { get; set; }
    public required string MimeType { get; set; }
    public required string Url { get; set; }

    public DbArt Art { get; set; } = null!;

    public Picture ConvertToDto() => new()
    {
        Id = Id,
        ArtId = ArtId,
        MimeType = MimeType,
        Url = Url,
    };
}