using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ITierRepository
{
    Task<Tier> CreateTier(string name, int profileId, int extends);
    Task<Tier?> GetTier(int id);
    Task<List<Tier>> GetTiersByProfile(int profileId);
    Task<bool> UpdateTier(Tier tier);
    Task<bool> DeleteTier(int id);
}
