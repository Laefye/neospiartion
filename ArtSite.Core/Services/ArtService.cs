using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Core.Models;

namespace ArtSite.Core.Services;

public class ArtService : IArtService
{
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;

    public ArtService(IArtRepository artRepository, IPictureRepository pictureRepository)
    {
        _artRepository = artRepository;
        _pictureRepository = pictureRepository;
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

    public async Task<Picture> AddPictureToArt(int artId, string url)
    {
        return await _pictureRepository.AddPicture(artId, url);
    }

    public async Task<List<Art>> GetAllArts(int offset, int limit)
    {
        return await _artRepository.GetAllArts(offset, limit);
    }

    public async Task<Art?> GetArt(int id)
    {
        return await _artRepository.GetArt(id);
    }

    public async Task<List<Art>> GetArtsByArtist(int artistId)
    {
        return await _artRepository.GetArts(artistId);
    }

    public async Task<List<Picture>> GetPicturesByArt(int artId)
    {
        return await _pictureRepository.GetPictures(artId);
    }
}
