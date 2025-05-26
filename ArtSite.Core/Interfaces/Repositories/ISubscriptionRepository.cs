using ArtSite.Core.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ISubscriptionRepository
{
    Task<Subscription> CreateSubscription(int profileId, int tierId, DateTime createdAt, DateTime expiresAt);

    Task<List<Subscription>> GetSubscriptions(int profileId);

    Task<Subscription?> GetSubscription(int subscriptionId);

    Task<Subscription?> GetSubscriptionOfProfileIdInArtist(int profileId, int artistId);

    Task DeleteAllSubscriptionsInTier(int tierId);

    Task DeleteSubscription(int subscriptionId);
}
