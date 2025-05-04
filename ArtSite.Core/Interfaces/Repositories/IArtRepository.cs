using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IArtRepository
{
    Task<Art> CreateArt(string? description, int artistId);

    Task<Art> CreateArtByDate(string? description, int artistId, DateTime uploadedAt);

    Task<Art?> GetArt(int id);

    Task<List<Art>> GetArts(int artistId);

    Task<List<Art>> GetAllArtsWithPictures(int offset, int limit);

    Task<List<Art>> GetAllArts(int offset, int limit);

    Task DeleteArt(int artId);
}
