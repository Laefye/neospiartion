using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface ITierService
{
    Task<Tier> CreateTier(string userId, string name, string description, int artistId, int price, int? extends);
    Task<Tier> GetTier(int id);
    Task<List<Tier>> GetTiers(int artistId);
    Task DeleteTier(string userId, int id);
}
