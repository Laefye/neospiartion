using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IStoragedFileRepository
{
    Task<StoragedFile> Add(int profileId, string mimeType, string url);

    Task<StoragedFile?> GetById(int id);
    
    Task Delete(int id);
}
