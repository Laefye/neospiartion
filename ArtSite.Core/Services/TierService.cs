using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class TierService : ITierService
{
    private readonly IArtistService _artistService;
    private readonly ITierRepository _tierRepository;
    private readonly IUserService _userService;
    private readonly IArtService _artService;

    public TierService(ITierRepository tierRepository, IUserService userService, IArtistService artistService, IArtService artService)
    {
        _artService = artService;
        _artistService = artistService;
        _tierRepository = tierRepository;
        _userService = userService;
    }
    
    public async Task<Tier> CreateTier(string userId, string name, string description, int artistId, int price, int? extends)
    {
        var profile = await _userService.FindProfile(userId);
        var artist = await _artistService.GetArtistAnywayByProfileId(profile.Id, true);
        if (extends != null)
        {
            var parentTier = await _tierRepository.GetTier(extends.Value);
            if (parentTier == null || parentTier.ArtistId != artist.Id)
                throw new TierException.NotFoundTier();
        }
        if (artistId != artist.Id)
            throw new TierException.NotOwnerTier();
        var tier = await _tierRepository.CreateTier(name, description, artist.Id, price, extends);
        return tier;
    }

    public async Task DeleteTier(string userId, int id)
    {
        var profile = await _userService.FindProfile(userId);
        var artist = await _artistService.GetArtistAnywayByProfileId(profile.Id);
        var tier = await _tierRepository.GetTier(id);
        if (tier == null)
            throw new TierException.NotFoundTier();
        if (tier.ArtistId != artist.Id)
            throw new TierException.NotOwnerTier();
        // TODO: Все тиры которые зависят от этого тира тоже удалить (или выдать ошибку)
        await _tierRepository.DeleteTier(tier.Id);
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
