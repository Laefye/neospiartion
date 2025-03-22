using ArtSite.Core.DTO;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class ArtistRepository : IArtistRepository
{
    private ApplicationDbContext _context;

    public ArtistRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Artist> CreateArtist(string name)
    {
        var entry = await _context.Artists.AddAsync(new DbArtist { Name = name, CreatedAt = DateTime.UtcNow });
        await _context.SaveChangesAsync();
        return entry.Entity.ConvertToDTO();
    }

    public async Task<Artist?> GetArtist(int id)
    {
        return (await _context.Artists.Where(artist => artist.Id == id).FirstOrDefaultAsync())?.ConvertToDTO();
    }
}
