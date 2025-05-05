using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ArtService : IArtService
{
    private readonly IUserService _userService;
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;
    private readonly IArtistService _artistService;
    private readonly IStorageService _storageService;
    private ITierService? _tierService = null;
    private ICommentService? _commentService = null;
    private IView? _view = null;
    
    public ArtService(IArtRepository artRepository, IArtistService artistService, IStorageService storageService, IUserService userService, IPictureRepository pictureRepository)
    {
        _artRepository = artRepository;
        _storageService = storageService;
        _userService = userService;
        _artistService = artistService;
        _pictureRepository = pictureRepository;
    }

    public IArtService Apply(ITierService tierService)
    {
        _tierService = tierService;
        return this;
    }

    public IArtService Apply(ICommentService commentService)
    {
        _commentService = commentService;
        return this;
    }

    public IArtService Apply(IView view)
    {
        _view = view;
        return this;
    }

    public async Task<Art> CreateArt(string userId, int artistId, string? description, int? tierId)
    {
        if (_tierService == null)
            throw new NotAppliedException("TierService");
        var profile = await _userService.FindProfile(userId);
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null || artist.Id != artistId)
            throw new ArtException.UnauthorizedArtistAccess();
        if (tierId != null)
        {
            var tier = await _tierService.GetMyTier(userId, tierId.Value);
        }
        var art = await _artRepository.CreateArt(description, artistId, tierId);
        return art;
    }

    public async Task DeleteArt(string userId, int artId)
    {
        if (_commentService == null)
            throw new NotAppliedException("CommentService");
        var profile = await _userService.FindProfile(userId);
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null)
            throw new ArtException.UnauthorizedArtistAccess();
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException.NotFoundArt();
        if (art.ArtistId != artist.Id)
            throw new ArtException.UnauthorizedArtistAccess();
        var pictures = await _pictureRepository.GetPictures(art.Id);
        foreach (var picture in pictures)
        {
            _storageService.DeleteFile(picture.Url);
            await _pictureRepository.DeletePicture(picture.Id);
        }
        await _commentService.ForceDeleteAllComments(art.Id);
        await _artRepository.DeleteArt(art.Id);
    }

    public async Task<List<Art>> GetAllArts(string userId, int offset, int limit)
    {
        var profile = await _userService.FindProfile(userId);
        return await _artRepository.GetAllArtsWithPictures(offset, limit);
    }

    public async Task<Art> GetArt(string? userId, int artId)
    {
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException.NotFoundArt();
        return art;
    }

    public async Task<Picture> GetPicture(string? userId, int pictureId)
    {
        var picture = await _pictureRepository.GetPicture(pictureId);
        if (picture == null)
            throw new ArtException.NotFoundPicture();
        return picture;
    }

    public async Task<List<Picture>> GetPictures(string? userId, int artId)
    {
        if (_view == null)
            throw new NotAppliedException("View");
        var art = await GetArt(userId, artId);
        if (!await _view.CanView(userId, art))
            throw new ArtException.UnauthorizedArtistAccess();
        var pictures = await _pictureRepository.GetPictures(art.Id);
        return pictures;
    }

    public async Task<Picture> UploadPicture(string userId, int artId, IPictureUploader pictureUploader)
    {
        var profile = await _userService.FindProfile(userId);
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null)
            throw new ArtException.UnauthorizedArtistAccess();
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException.NotFoundArt();
        if (art.ArtistId != artist.Id)
            throw new ArtException.UnauthorizedArtistAccess();
        var fileUri = await _storageService.CreateFile();
        var fileStream = await _storageService.OpenFile(fileUri, FileAccess.Write);
        pictureUploader.Upload(fileStream);
        fileStream.Close();
        return await _pictureRepository.AddPicture(art.Id, fileUri, pictureUploader.MimeType);
    }
}
