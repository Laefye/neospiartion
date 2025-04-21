using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbProfile
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Name { get; set; }
    public required string UserId { get; set; }
    public Profile ConvertToDto() => new()
    {
        Id = Id,
        Name = Username,
        UserId = UserId,
        Username =  Username,
    };
}