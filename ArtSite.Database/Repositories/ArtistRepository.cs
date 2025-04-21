using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class ArtistRepository(ApplicationDbContext context) : IArtistRepository
{
    public async Task<Artist> CreateArtist(int profileId)
    {
        var entry = await context.Artists.AddAsync(new DbArtist
        {
            CreatedAt = DateTime.UtcNow,
            ProfileId = profileId
        });
        await context.SaveChangesAsync();
        return entry.Entity.ConvertToDTO();
    }

    public async Task<Artist?> GetArtist(int id)
    {
        return (await context.Artists.Where(artist => artist.Id == id).FirstOrDefaultAsync())?.ConvertToDTO();
    }
}
