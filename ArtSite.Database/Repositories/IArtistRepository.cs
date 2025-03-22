using ArtSite.Core.DTO;

namespace ArtSite.Database.Repositories;

public interface IArtistRepository
{
    Task<Artist> CreateArtist(string name);

    Task<Artist?> GetArtist(int id);
}

