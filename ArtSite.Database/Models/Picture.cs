namespace ArtSite.Database.Models;

public class Picture : ICloneable
{
    public int Id { get; set; }
    public required int ArtId { get; set; }
    public required string Url { get; set; }

    public object Clone()
    {
        return new Picture
        {
            Id = Id,
            ArtId = ArtId,
            Url = Url
        };
    }
}