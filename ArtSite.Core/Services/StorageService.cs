using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class StorageService : IStorageService
{
    private readonly IStoragedFileRepository _storagedFileRepository;
    private IProfileService _profileService = null!;

    public StorageService(IStoragedFileRepository storagedFileRepository)
    {
        _storagedFileRepository = storagedFileRepository;
    }

    public IStorageService Apply(IProfileService profileService)
    {
        _profileService = profileService;
        return this;
    }

    private string CreateFile()
    {
        var guid = Guid.NewGuid().ToString();
        if (!Directory.Exists("Uploads"))
            Directory.CreateDirectory("Uploads");

        var fileName = Path.Combine("Uploads", guid);

        File.Create(fileName).Close();

        return "fs://local/" + guid;
    }

    private void DeleteFile(string uri)
    {
        if (!uri.StartsWith("fs://local/"))
            throw new ArgumentException("Invalid URI format", nameof(uri));

        var guid = uri.Substring("fs://local/".Length);
        var filePath = Path.Combine("Uploads", guid);

        if (File.Exists(filePath))
            File.Delete(filePath);
    }

    public async Task DeleteFile(string userId, int fileId)
    {
        if (_profileService == null)
            throw new NotAppliedException("ProfileService");
        var file = await _storagedFileRepository.GetById(fileId);
        if (file == null)
            throw new StorageException.FileNotFound();
        var profile = await _profileService.GetProfileByUserId(userId);
        if (file.ProfileId != profile.Id)
            throw new StorageException.NotOwner();
        DeleteFile(file.Url);
        await _storagedFileRepository.Delete(fileId);
    }

    public async Task<StoragedFile> GetFile(int fileId)
    {
        var file = await _storagedFileRepository.GetById(fileId);
        if (file == null)
            throw new StorageException.FileNotFound();
        return file;
    }

    private Stream OpenFile(string uri, FileAccess fileAccess)
    {
        if (!uri.StartsWith("fs://local/"))
            throw new ArgumentException("Invalid URI format", nameof(uri));

        var guid = uri.Substring("fs://local/".Length);
        var filePath = Path.Combine("Uploads", guid);

        if (!File.Exists(filePath))
            throw new FileNotFoundException("File not found", filePath);
        
        return new FileStream(
            filePath,
            FileMode.Open,
            fileAccess,
            FileShare.Read,
            bufferSize: 4096,
            useAsync: true
        );
    }

    public async Task<StoragedFile> UploadFile(string userId, IFileUploader uploader)
    {
        if (_profileService == null)
            throw new NotAppliedException("ProfileService");
        var fileUri = CreateFile();
        using (var stream = OpenFile(fileUri, FileAccess.Write))
        {
            uploader.Upload(stream);
        }
        var profile = await _profileService.GetProfileByUserId(userId);
        return await _storagedFileRepository.Add(profile.Id, uploader.MimeType, fileUri);
    }

    public async Task<IFile> OpenFile(int fileId)
    {
        var file = await GetFile(fileId);
        return new StoragedFileStream(file, OpenFile(file.Url, FileAccess.Read));
    }
}
