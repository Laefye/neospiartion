using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class TierService : ITierService
{
    private readonly IProfileService _profileService;
    private readonly ITierRepository _tierRepository;
    private readonly IStorageService _storageService;
    private ISubscriptionService? _subscriptionService = null;
    private readonly IArtRepository _artRepository;

    public TierService(ITierRepository tierRepository, IProfileService profileService, IStorageService storageService, IArtRepository artRepository)
    {
        _tierRepository = tierRepository;
        _profileService = profileService;
        _storageService = storageService;
        _artRepository = artRepository;
    }

    public ITierService Apply(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
        return this;
    }

    public async Task<Tier> CreateTier(string userId, string name, string description, int profileId, int price, int? extends)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        if (extends != null)
        {
            var parentTier = await _tierRepository.GetTier(extends.Value);
            if (parentTier == null || parentTier.ProfileId != profile.Id)
                throw new TierException.NotFoundTier();
        }
        if (profileId != profile.Id)
            throw new TierException.NotOwnerTier();
        var tier = await _tierRepository.CreateTier(name, description, profile.Id, price, extends);
        return tier;
    }

    public async Task DeleteTier(string userId, int id)
    {
        if (_subscriptionService == null)
            throw new NotAppliedException("SubscriptionService");
        var profile = await _profileService.GetProfileByUserId(userId);
        var tier = await _tierRepository.GetTier(id);
        if (tier == null)
            throw new TierException.NotFoundTier();
        if (tier.ProfileId != profile.Id)
            throw new TierException.NotOwnerTier();
        if ((await _tierRepository.GetChildTiers(id)).Count > 0)
            throw new TierException.HasChildTiers();
        if (tier.Avatar != null)
        {
            var file = await _storageService.Apply(_profileService).GetFile(tier.Avatar.Value);
            await _storageService.DeleteFile(userId, file.Id);
        }
        var arts = await _artRepository.GetArtsByTierId(id);
        foreach (var art in arts)
        {
            if (art.TierId == id)
            {
                art.TierId = null;
                await _artRepository.UpdateArt(art);
            }
        }
        await _subscriptionService.UnscribeAll(tier.Id);
        await _tierRepository.DeleteTier(tier.Id);
    }

    public async Task<IFile> GetAvatar(int tierId)
    {
        var tier = await GetTier(tierId);
        if (tier.Avatar == null)
            throw new TierException.NotFoundAvatar();
        var file = await _storageService.OpenFile(tier.Avatar.Value);
        return file;
    }

    public async Task<Tier> GetMyTier(string userId, int tierId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var tier = await _tierRepository.GetTier(tierId);
        if (tier == null)
            throw new TierException.NotFoundTier();
        if (tier.ProfileId != profile.Id)
            throw new TierException.NotOwnerTier();
        return tier;
    }

    public async Task<Tier> GetTier(int id)
    {
        var tier = await _tierRepository.GetTier(id);
        if (tier == null)
            throw new TierException.NotFoundTier();
        return tier;
    }

    public Task<List<Tier>> GetTiers(int artistId)
    {
        return _tierRepository.GetTiersByProfile(artistId);
    }

    public async Task UpdateAvatar(string userId, int tierId, IFileUploader fileUploader)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var tier = await GetTier(tierId);
        if (tier.ProfileId != profile.Id)
            throw new TierException.NotOwnerTier();
        if (tier.Avatar != null) {
            var oldFile = await _storageService.Apply(_profileService).GetFile(tier.Avatar.Value);
            await _storageService.DeleteFile(userId, oldFile.Id);
        }
        var file = await _storageService.Apply(_profileService).UploadFile(userId, fileUploader);
        tier.Avatar = file.Id;
        await _tierRepository.UpdateTier(tier);
    }
}
