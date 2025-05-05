using ArtSite.Core.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Interfaces.Services;

public interface ISubscriptionService: IView
{
    Task<List<Subscription>> GetSubscriptions(string userId);

    Task<Subscription> GetSubscription(string userId, int subscriptionId);

    Task<Subscription> Subscribe(string userId, int tierId);
}

