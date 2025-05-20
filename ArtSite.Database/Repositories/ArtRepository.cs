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

    public Task<Art> CreateArt(string? description, int artistId, int? tierId)
    {
        return CreateArtByDate(description, artistId, tierId, DateTime.UtcNow);
    }

    public async Task<Art> CreateArtByDate(string? description, int artistId, int? tierId, DateTime uploadedAt)
    {
        var entry = await _context.Arts.AddAsync(new DbArt { Description = description, ProfileId = artistId, TierId = tierId, UploadedAt = uploadedAt });
        await _context.SaveChangesAsync();
        return entry.Entity.ConvertToDto();
    }

    public async Task DeleteArt(int artId)
    {
        var art = await _context.Arts.FindAsync(artId);
        if (art != null)
            _context.Arts.Remove(art);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Art>> GetAllArts(int offset, int limit)
    {
        return await _context.Arts
            .OrderByDescending(art => art.UploadedAt)
            .Select(art => art.ConvertToDto())
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Art>> GetAllArtsWithPictures(int offset, int limit)
    {
        return await _context.Arts
            .Include(art => art.Pictures)
            .Where(art => art.Pictures.Count > 0)
            .OrderByDescending(art => art.UploadedAt)
            .Select(art => art.ConvertToDto())
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Art?> GetArt(int id)
    {
        return (await _context.Arts.Where(art => art.Id == id).FirstOrDefaultAsync())?.ConvertToDto();
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        return await _context.Arts.OrderByDescending(art => art.UploadedAt).Where(art => art.ProfileId == artistId).Select(art => art.ConvertToDto()).ToListAsync();
    }
}
