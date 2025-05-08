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
    private readonly IUserService _userService;
    private readonly IArtService _artService;

    public TierService(ITierRepository tierRepository, IUserService userService, IProfileService profileService, IArtService artService)
    {
        _artService = artService;
        _tierRepository = tierRepository;
        _userService = userService;
        _profileService = profileService;
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
        var profile = await _profileService.GetProfileByUserId(userId);
        var tier = await _tierRepository.GetTier(id);
        if (tier == null)
            throw new TierException.NotFoundTier();
        if (tier.ProfileId != profile.Id)
            throw new TierException.NotOwnerTier();
        // TODO: Все тиры которые зависят от этого тира тоже удалить (или выдать ошибку)
        await _tierRepository.DeleteTier(tier.Id);
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
        return _tierRepository.GetTiersByArtist(artistId);
    }
}
