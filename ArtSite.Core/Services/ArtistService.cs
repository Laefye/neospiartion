using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ArtistService : IArtistService
{
    private readonly IArtistRepository _artistRepository;

    public ArtistService(IArtistRepository artistRepository)
    {
        _artistRepository = artistRepository;
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

    public async Task<Artist?> GetArts(int profileId)
    {
        var artist = await _artistRepository.FindArtistByProfileId(profileId);
        if (artist == null)
            throw new ArtistException("Artist not found");
        return artist;
    }
}
