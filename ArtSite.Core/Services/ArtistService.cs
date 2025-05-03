using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ArtistService : IArtistService
{
    private readonly IArtistRepository _artistRepository;
    private readonly IArtRepository _artRepository;

    public ArtistService(IArtistRepository artistRepository, IArtRepository artRepository)
    {
        _artistRepository = artistRepository;
        _artRepository = artRepository;
    }

    public async Task<Artist> CreateArtist(int profileId)
    {
        var existingArtist = await _artistRepository.FindArtistByProfileId(profileId);
        if (existingArtist != null)
            throw new ArtistException("Artist already exists");
        var artist = await _artistRepository.CreateArtist(profileId);
        return artist;
    }

    public async Task<Artist?> GetArtist(int id)
    {
        return await _artistRepository.GetArtist(id);
    }

    public Task<Artist?> GetArtistByProfileId(int profileId)
    {
        return _artistRepository.FindArtistByProfileId(profileId);
    }

    public async Task<List<Art>> GetArts(int artistId)
    {
        var artist = _artistRepository.GetArtist(artistId);
        if (artist == null)
            throw new ArtistException("Artist not found");
        return await _artRepository.GetArts(artistId);
    }
}
