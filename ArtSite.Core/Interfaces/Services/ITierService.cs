using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface ITierService
{
    Task<Tier> CreateTier(string userId, string name, string description, int profileId, int price, int? extends);
    Task<Tier> GetTier(int id);
    Task<List<Tier>> GetTiers(int profileId);
    Task DeleteTier(string userId, int id);
    Task<Tier> GetMyTier(string userId, int tierId);
    Task UpdateAvatar(string userId, int tierId, IFileUploader fileUploader);
    Task<IFile> GetAvatar(int tierId);
}
