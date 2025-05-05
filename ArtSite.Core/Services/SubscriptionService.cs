using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly ITierService _tierService;
    private readonly IArtistService _artistService;
    private readonly IUserService _userService;
    private readonly ISubscriptionRepository _subscriptionRepository;

    public SubscriptionService(ITierService tierService, IUserService userService, IArtistService artistService, ISubscriptionRepository subscriptionRepository)
    {
        _tierService = tierService;
        _userService = userService;
        _artistService = artistService;
        _subscriptionRepository = subscriptionRepository;
    }

    private async Task<bool> IsMyTier(int profileId, Tier tier)
    {
        try
        {
            var artist = await _artistService.GetArtistAnywayByProfileId(profileId, true);
            return artist.Id == tier.ArtistId;
        }
        catch (ArtistException.NotArtist)
        {
            return false;
        }
    }

    public async Task<Subscription> Subscribe(string userId, int tierId)
    {
        var profile = await _userService.FindProfile(userId);
        var tier = await _tierService.GetTier(tierId);
        if (await IsMyTier(profile.Id, tier))
            throw new SubscriptionException.ItsYou();
        var subscription = await _subscriptionRepository.GetSubscriptionOfProfileIdInArtist(profile.Id, tier.ArtistId);
        if (subscription != null)
            throw new SubscriptionException.AlreadySubscribed();
        return await _subscriptionRepository.CreateSubscription(profile.Id, tierId, DateTime.Now.ToUniversalTime(), DateTime.Now.AddDays(30).ToUniversalTime());
    }

    public async Task<Artist?> GetArtist(int profileId)
    {
        try
        {
            return await _artistService.GetArtistAnywayByProfileId(profileId, true);
        }
        catch (ArtistException.NotArtist)
        {
            return null;
        }
    }

    private async Task<bool> InTreeTier(int targetTierId, Tier? current)
    {
        while (current != null)
        {
            if (current.Id == targetTierId)
            {
                return true;
            }
            if (current.Extends == null)
            {
                current = null;
            }
            else
            {
                current = await _tierService.GetTier(current.Extends.Value);
            }
        }
        return false;
    }

    public async Task<bool> CanView(string? userId, Art art)
    {
        if (art.TierId == null)
            return true;
        if (userId == null)
            return false;
        var profile = await _userService.FindProfile(userId);
        var thisArtist = await GetArtist(profile.Id);
        if (art.ArtistId == thisArtist?.Id)
            return true;
        var subscription = await _subscriptionRepository.GetSubscriptionOfProfileIdInArtist(profile.Id, art.ArtistId);
        if (subscription == null)
            return false;
        return await InTreeTier(art.TierId.Value, await _tierService.GetTier(subscription.TierId));
    }

    public async Task<List<Subscription>> GetSubscriptions(string userId)
    {
        var profile = await _userService.FindProfile(userId);
        return await _subscriptionRepository.GetSubscriptions(profile.Id);
    }

    public async Task<Subscription> GetSubscription(string userId, int subscriptionId)
    {
        var profile = await _userService.FindProfile(userId);
        var subscription = await _subscriptionRepository.GetSubscription(subscriptionId);
        if (subscription == null || subscription.ProfileId != profile.Id)
            throw new SubscriptionException.NotFound();
        return subscription;
    }
}

