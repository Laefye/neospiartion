namespace ArtSite.Core.DTO;
public class Picture
{
    public int Id { get; init; }
    public int ArtId { get; init; }
    public required string Url { get; init; }
}