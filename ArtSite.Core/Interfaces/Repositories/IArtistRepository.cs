using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IArtistRepository
{
    Task<Artist> CreateArtist(int profileId);

    Task<Artist?> GetArtist(int id);
}
