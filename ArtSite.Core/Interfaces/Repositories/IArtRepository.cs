using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IArtRepository
{
    Task<Art> CreateArt(string? description, int artistId, int? tierId);

    Task<Art> CreateArtByDate(string? description, int artistId, int? tierId, DateTime uploadedAt);

    Task<Art?> GetArt(int id);

    Task<List<Art>> GetArts(int artistId);

    Task<Countable<Art>> GetAllArtsWithPictures(int offset, int limit);

    Task<List<Art>> GetAllArts(int offset, int limit);

    Task DeleteArt(int artId);

    Task<Art> UpdateArt(Art art);

    Task<List<Art>> GetArtsByTierId(int tierId);
}
