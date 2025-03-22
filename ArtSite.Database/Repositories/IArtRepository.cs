using ArtSite.Core.DTO;

namespace ArtSite.Database.Repositories;

public interface IArtRepository
{
    Task<Art> CreateArt(string? description, int artistId);

    Task<Art> CreateArtByDate(string? description, int artistId, DateTime uploadedAt);

    Task<Art?> GetArt(int id);

    Task<List<Art>> GetArts(int artistId);
}
