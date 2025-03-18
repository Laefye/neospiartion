namespace ArtSite.Database.Models;

public class Artist : ICloneable
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; }


    public object Clone()
    {
        return new Artist
        {
            Id = Id,
            Name = Name,
            CreatedAt = CreatedAt
        };
    }
}