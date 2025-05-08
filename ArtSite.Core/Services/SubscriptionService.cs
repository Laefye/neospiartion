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
    private readonly IProfileService _profileService;
    private readonly ISubscriptionRepository _subscriptionRepository;

    public SubscriptionService(ITierService tierService, IProfileService profileService, ISubscriptionRepository subscriptionRepository)
    {
        _tierService = tierService;
        _profileService = profileService;
        _subscriptionRepository = subscriptionRepository;
    }

    private async Task<bool> IsMyTier(int profileId, Tier tier)
    {
        try
        {
            var profile = await _profileService.GetProfile(profileId);
            return profile.Id == tier.ProfileId;
        }
        catch (ArtistException.NotArtist)
        {
            return false;
        }
    }

    public async Task<Subscription> Subscribe(string userId, int tierId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var tier = await _tierService.GetTier(tierId);
        if (await IsMyTier(profile.Id, tier))
            throw new SubscriptionException.ItsYou();
        var subscription = await _subscriptionRepository.GetSubscriptionOfProfileIdInArtist(profile.Id, tier.ProfileId);
        if (subscription != null)
            throw new SubscriptionException.AlreadySubscribed();
        return await _subscriptionRepository.CreateSubscription(profile.Id, tierId, DateTime.Now.ToUniversalTime(), DateTime.Now.AddDays(30).ToUniversalTime());
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
        var profile = await _profileService.GetProfileByUserId(userId);
        if (art.ProfileId == profile.Id)
            return true;
        var subscription = await _subscriptionRepository.GetSubscriptionOfProfileIdInArtist(profile.Id, art.ProfileId);
        if (subscription == null)
            return false;
        return await InTreeTier(art.TierId.Value, await _tierService.GetTier(subscription.TierId));
    }

    public async Task<Subscription> GetSubscription(string userId, int subscriptionId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var subscription = await _subscriptionRepository.GetSubscription(subscriptionId);
        if (subscription == null || subscription.ProfileId != profile.Id)
            throw new SubscriptionException.NotFound();
        return subscription;
    }

    public async Task<List<Subscription>> GetSubscriptions(string userId, int profileId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        if (profile.Id != profileId)
            throw new SubscriptionException.NotOwned();
        return await _subscriptionRepository.GetSubscriptions(profileId);
    }
}

