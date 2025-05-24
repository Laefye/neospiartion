using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ArtService : IArtService
{
    private readonly IArtRepository _artRepository;
    private readonly IPictureRepository _pictureRepository;
    private readonly IProfileService _profileService;
    private readonly IStorageService _storageService;
    private ITierService? _tierService = null;
    private ICommentService? _commentService = null;
    private IView? _view = null;
    
    public ArtService(IArtRepository artRepository, IProfileService profileService, IStorageService storageService, IPictureRepository pictureRepository)
    {
        _artRepository = artRepository;
        _storageService = storageService;
        _profileService = profileService;
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

    public async Task<Art> CreateArt(string userId, int profileId, string? description, int? tierId)
    {
        if (_tierService == null)
            throw new NotAppliedException("TierService");
        var profile = await _profileService.GetProfileByUserId(userId);
        if (profile.Id != profileId)
            throw new ArtException.UnauthorizedArtistAccess();
        if (tierId != null)
        {
            var tier = await _tierService.GetMyTier(userId, tierId.Value);
        }
        var art = await _artRepository.CreateArt(description, profileId, tierId);
        return art;
    }

    public async Task DeleteArt(string userId, int artId)
    {
        if (_commentService == null)
            throw new NotAppliedException("CommentService");
        var profile = await _profileService.GetProfileByUserId(userId);
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException.NotFoundArt();
        if (art.ProfileId != profile.Id)
            throw new ArtException.UnauthorizedArtistAccess();
        var pictures = await _pictureRepository.GetPictures(art.Id);
        foreach (var picture in pictures)
        {
            await _storageService.DeleteFile(userId, picture.StoragedFileId);
            await _pictureRepository.DeletePicture(picture.Id);
        }
        await _commentService.ForceDeleteAllComments(art.Id);
        await _artRepository.DeleteArt(art.Id);
    }

    public async Task<Countable<Art>> GetAllArts(string? userId, int offset, int limit)
    {
        //var profile = await _profileService.GetProfileByUserId(userId);
        return await _artRepository.GetAllArtsWithPictures(offset, limit);
    }

    public async Task<Art> GetArt(string? userId, int artId)
    {
        var art = await _artRepository.GetArt(artId);
        if (art == null)
            throw new ArtException.NotFoundArt();
        return art;
    }

    public async Task<IFile> GetPictureFile(string? userId, int pictureId)
    {
        var picture = await GetPicture(userId, pictureId);
        return await _storageService.OpenFile(picture.StoragedFileId);
    }

    public async Task<Picture> GetPicture(string? userId, int pictureId)
    {
        if (_view == null)
            throw new NotAppliedException("View");
        var picture = await _pictureRepository.GetPicture(pictureId);
        if (picture == null)
            throw new ArtException.NotFoundPicture();
        var art = await GetArt(userId, picture.ArtId);
        if (!await _view.CanView(userId, art))
            throw new ArtException.UnauthorizedArtistAccess();
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

    public async Task<Picture> UploadPicture(string userId, int artId, IFileUploader pictureUploader)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var art = await GetArt(userId, artId);
        if (art.ProfileId != profile.Id)
            throw new ArtException.UnauthorizedArtistAccess();
        var storagedFile = await _storageService.Apply(_profileService).UploadFile(userId, pictureUploader);
        return await _pictureRepository.AddPicture(art.Id, storagedFile.Id);
    }
}
