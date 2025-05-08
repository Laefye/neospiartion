using ArtSite.Core.DTO;
using System.Xml.Linq;

namespace ArtSite.Database.Models;

public class DbPicture
{
    public int Id { get; set; }
    public int ArtId { get; set; }
    public int StoragedFileId { get; set; } 

    public DbArt Art { get; set; } = null!;

    public Picture ConvertToDto() => new()
    {
        Id = Id,
        ArtId = ArtId,
        StoragedFileId = StoragedFileId,
    };
}