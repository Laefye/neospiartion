using ArtSite.Core.Models;
using ArtSite.Database;
using ArtSite.Database.Models;
using ArtSite.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Services;

public class ArtistService : IArtistService
{
    private readonly ApplicationDbContext _db;

    public ArtistService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Artist> CreateArtist(string name)
    {
        if (string.IsNullOrEmpty(name)) throw new ArgumentException("Name cannot be empty");
        var artist = await _db.Artists.AddAsync(new Artist { Name = name, CreatedAt = DateTime.Now.ToUniversalTime() });
        await _db.SaveChangesAsync();
        return (Artist)artist.Entity.Clone();
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        return await _db.Arts.Where(art => art.ArtistId == artistId).Select(art => (Art)art.Clone()).ToListAsync();
    }

    public async Task<Art> CreateArt(int artistId, string? description, List<string> photos)
    {
        var art = await _db.Arts.AddAsync(
            new Art
            {
                ArtistId = artistId,
                Description = description,
                UploadedAt = DateTime.Now
            }
        );
        await _db.SaveChangesAsync();
        foreach (var photo in photos) await _db.Pictures.AddAsync(new Picture { ArtId = art.Entity.Id, Url = photo });
        await _db.SaveChangesAsync();
        return (Art)art.Entity.Clone();
    }

    public async Task<Art> ImportArt(int artistId, ExportedArt exportedArt)
    {
        var art = await _db.Arts.AddAsync(
            new Art
            {
                ArtistId = artistId,
                Description = exportedArt.Description,
                UploadedAt = exportedArt.UploadedDate
            }
        );
        await _db.SaveChangesAsync();
        foreach (var picture in exportedArt.Pictures)
            await _db.Pictures.AddAsync(new Picture { ArtId = art.Entity.Id, Url = picture });
        await _db.SaveChangesAsync();
        return (Art)art.Entity.Clone();
    }

    public Task<List<Picture>> GetPictures(int artId)
    {
        return _db.Pictures.Where(picture => picture.ArtId == artId).Select(picture => (Picture)picture.Clone())
            .ToListAsync();
    }
}