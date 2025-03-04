namespace ArtSite.Core.Models;

public class ExportedArt
{
    public string? Description { get; set; }
    public required List<string> Pictures { get; set; }
    public required DateTime UploadedDate { get; set; }
}