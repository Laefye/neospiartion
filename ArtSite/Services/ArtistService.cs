using ArtSite.Core.DTO;
using ArtSite.Core.Models;
using ArtSite.Database.Repositories;
using ArtSite.Services.Interfaces;

namespace ArtSite.Services;

public class ArtistService : IArtistService
{
    private readonly IArtistRepository _artistRepository;
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;

    public ArtistService(IArtistRepository db, IArtRepository artRepository, IPictureRepository pictureRepository)
    {
        _artistRepository = db;
        _artRepository = artRepository;
        _pictureRepository = pictureRepository;
    }

    public async Task<Artist> CreateArtist(string name)
    {
        if (string.IsNullOrEmpty(name)) throw new ArgumentException("Name cannot be empty");
        return await _artistRepository.CreateArtist(name);
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        return await _artRepository.GetArts(artistId);
    }

    public async Task<Art> CreateArt(int artistId, string? description, List<string> pictures)
    {
        var art = await _artRepository.CreateArt(description, artistId);
        foreach (var url in pictures)
        {
            await _pictureRepository.AddPicture(art.Id, url);
        }
        return art;
    }

    public async Task<Art> ImportArt(int artistId, ExportedArt exportedArt)
    {
        var art = await _artRepository.CreateArtByDate(exportedArt.Description, artistId, exportedArt.UploadedDate);
        foreach (var url in exportedArt.Pictures)
        {
            await _pictureRepository.AddPicture(art.Id, url);
        }
        return art;
    }

    public async Task<List<Picture>> GetPictures(int artId)
    {
        return await _pictureRepository.GetPictures(artId);
    }

    public async Task<Artist?> GetArtist(int id)
    {
        return await _artistRepository.GetArtist(id);
    }
}