using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
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
        return entry.Entity.ConvertToDto();
    }

    public async Task<List<Art>> GetAllArts(int offset, int limit)
    {
        return await _context.Arts.Select(art => art.ConvertToDto()).Skip(offset).Take(limit).ToListAsync();
    }

    public async Task<Art?> GetArt(int id)
    {
        return (await _context.Arts.Where(art => art.Id == id).FirstOrDefaultAsync())?.ConvertToDto();
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        return await _context.Arts.Where(art => art.ArtistId == artistId).Select(art => art.ConvertToDto()).ToListAsync();
    }
}
