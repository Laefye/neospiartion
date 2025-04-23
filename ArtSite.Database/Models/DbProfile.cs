using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbProfile
{
    public int Id { get; set; }
    public required string DisplayName { get; set; }
    public required string UserId { get; set; }
    public Profile ConvertToDto() => new()
    {
        Id = Id,
        DisplayName = DisplayName,
        UserId = UserId,
    };
}