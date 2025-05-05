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
}

