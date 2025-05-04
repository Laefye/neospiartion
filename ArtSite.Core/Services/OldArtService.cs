using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Core.Models;
using Microsoft.AspNetCore.Http;

namespace ArtSite.Core.Services;

public class OldArtService : IOldArtService
{
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;
    private readonly IStorageService _storageService;

    public OldArtService(IArtRepository artRepository, IPictureRepository pictureRepository, IStorageService storageService)
    {
        _artRepository = artRepository;
        _pictureRepository = pictureRepository;
        _storageService = storageService;
    }

    public async Task<Art> CreateArt(int artistId, string? description, List<string> pictures)
    {
        var art = await _artRepository.CreateArt(description, artistId);
        foreach (var url in pictures)
        {
            throw new NotImplementedException();
            await _pictureRepository.AddPicture(art.Id, url, "");
        }
        return art;
    }

    public async Task<Art> ImportArt(int artistId, ExportedArt exportedArt)
    {
        var art = await _artRepository.CreateArtByDate(exportedArt.Description, artistId, exportedArt.UploadedDate);
        foreach (var url in exportedArt.Pictures)
        {
            throw new NotImplementedException();
            await _pictureRepository.AddPicture(art.Id, url, "");
        }
        return art;
    }

    public async Task<Picture> AddPictureToArt(int artId, IFormFile file, string mimeType)
    {
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException("Art not found");
        var url = await _storageService.CreateFile();
        using (var stream = await _storageService.OpenFile(url, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }
        var picture = await _pictureRepository.AddPicture(artId, url, mimeType);
        return picture;
    }

    public async Task<List<Art>> GetAllArts(int offset, int limit)
    {
        return await _artRepository.GetAllArtsWithPictures(offset, limit);
    }

    public async Task<Art?> GetArt(int id)
    {
        return await _artRepository.GetArt(id);
    }

    public async Task<List<Picture>> GetPicturesByArt(int artId)
    {
        return await _pictureRepository.GetPictures(artId);
    }

    public async Task<Art> CreateArt(int artistId, string? description)
    {
        var art = await _artRepository.CreateArt(description, artistId);
        return art;
    }

    public Task<Picture?> GetPicture(int pictureId)
    {
        return _pictureRepository.GetPicture(pictureId);
    }

    public async Task DeleteArt(int artId)
    {
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            return;
        var pictures = await _pictureRepository.GetPictures(artId);
        foreach (var picture in pictures)
        {
            await _pictureRepository.DeletePicture(picture.Id);
            _storageService.DeleteFile(picture.Url);
        }
        await _artRepository.DeleteArt(artId);
    }
}
