using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbProfile
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string UserId { get; set; }
    public Profile ConvertToDTO() => new Profile
    {
        Id = Id,
        Name = Username,
        Comments = new List<Comment>()
    };
}