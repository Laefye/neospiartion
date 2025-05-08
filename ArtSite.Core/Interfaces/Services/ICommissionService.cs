using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface ICommissionService
{
    Task<Commission> CreateCommission(string userId, int profileId, string name, string description, int price);
    Task<Commission> GetCommission(int id);
    Task DeleteCommission(string userId, int id);
    Task UpdateCommission(string userId, int id, string name, string description, int price);
    Task<List<Commission>> GetCommissionsByProfileId(int profileId);
    Task UpdateImage(string userId, int id, IFileUploader file);
    Task<IFile> GetImage(int id);
    Task DeleteImage(string userId, int id);
}
