using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface IStorageService
{
    IStorageService Apply(IProfileService profileService);

    Task<StoragedFile> UploadFile(string userId, IFileUploader uploader);

    Task DeleteFile(string userId, int fileId);

    Task<StoragedFile> GetFile(int fileId);

    Task<IFile> OpenFile(int fileId);
}
