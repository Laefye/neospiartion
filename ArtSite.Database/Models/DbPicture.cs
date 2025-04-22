using ArtSite.Core.DTO;
using System.Xml.Linq;

namespace ArtSite.Database.Models;

public class DbPicture
{
    public int Id { get; set; }
    public required int ArtId { get; set; }
    public required string Url { get; set; }

    public Picture ConvertToDTO() => new Picture
    {
        Id = Id,
        ArtId = ArtId,
        Url = Url,
    };
}