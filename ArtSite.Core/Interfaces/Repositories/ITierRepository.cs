using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ITierRepository
{
    Task<Tier> CreateTier(string name, string description, int artistId, int price, int? extends);
    Task<Tier?> GetTier(int id);
    Task<List<Tier>> GetTiersByArtist(int artistId);
    Task UpdateTier(Tier tier);
    Task DeleteTier(int id);
}
