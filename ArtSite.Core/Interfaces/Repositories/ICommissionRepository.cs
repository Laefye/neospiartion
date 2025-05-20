using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ICommissionRepository
{
    Task<Commission> CreateCommission(string name, string description, int profileId, int price);
    Task<Commission?> GetCommission(int id);
    Task DeleteCommission(int id);
    Task UpdateCommission(Commission commission);
    Task<List<Commission>> GetCommissionsByProfileId(int profileId);
}
