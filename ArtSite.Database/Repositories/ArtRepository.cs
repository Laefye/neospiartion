using ArtSite.Core.DTO;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class ArtRepository : IArtRepository
{
    private readonly ApplicationDbContext _context;

    public ArtRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Art> CreateArt(string? description, int artistId)
    {
        return CreateArtByDate(description, artistId, DateTime.UtcNow);
    }

    public async Task<Art> CreateArtByDate(string? description, int artistId, DateTime uploadedAt)
    {
        var entry = await _context.Arts.AddAsync(new DbArt { Description = description, ArtistId = artistId, UploadedAt = uploadedAt });
        await _context.SaveChangesAsync();
        return entry.Entity.ConvertToDTO();
    }

    public async Task<Art?> GetArt(int id)
    {
        return (await _context.Arts.Where(art => art.Id == id).FirstOrDefaultAsync())?.ConvertToDTO();
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        return await _context.Arts.Where(art => art.ArtistId == artistId).Select(art => art.ConvertToDTO()).ToListAsync();
    }
}
