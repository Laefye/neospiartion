using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class PictureRepository : IPictureRepository
{
    private readonly ApplicationDbContext _context;

    public PictureRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Picture> AddPicture(int artId, string url)
    {
        var picture = await _context.Pictures.AddAsync(new DbPicture { ArtId = artId, Url = url });
        await _context.SaveChangesAsync();
        return picture.Entity.ConvertToDTO();
    }

    public async Task<List<Picture>> GetPictures(int artId)
    {
        return await _context.Pictures.Where(p => p.ArtId == artId).Select(p => p.ConvertToDTO()).ToListAsync();
    }
}
