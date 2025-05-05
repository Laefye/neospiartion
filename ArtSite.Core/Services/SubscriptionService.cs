using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
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

    public Task<List<Subscription>> GetSubscriptions(string userId)
    {
        throw new NotImplementedException();
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
        {
            throw new SubscriptionException.ItsYou();
        }
        return await _subscriptionRepository.CreateSubscription(profile.Id, tierId, DateTime.Now.ToUniversalTime(), DateTime.Now.AddDays(30).ToUniversalTime());
    }
}

