using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Database.Repositories.Interfaces;

namespace ArtSite.Services;

public class ArtService : IArtService
{
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;

    public ArtService(IArtRepository artRepository, IPictureRepository pictureRepository)
    {
        _artRepository = artRepository;
        _pictureRepository = pictureRepository;
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

    public async Task<List<Picture>> GetPicturesByArt(int artId)
    {
        return await _pictureRepository.GetPictures(artId);
    }
}
