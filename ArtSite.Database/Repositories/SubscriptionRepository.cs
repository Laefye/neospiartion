using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class SubscriptionRepository(ApplicationDbContext _context) : ISubscriptionRepository
{
    public async Task<Subscription> CreateSubscription(int profileId, int tierId, DateTime createdAt, DateTime expiresAt)
    {
        var element = await _context.Subscriptions.AddAsync(new DbSubscription
        {
            TierId = tierId,
            ProfileId = profileId,
            CreatedAt = createdAt,
            ExpiresAt = expiresAt,
        });
        await _context.SaveChangesAsync();
        return element.Entity.ConvertToDto();
    }

    public async Task DeleteAllSubscriptionsInTier(int tierId)
    {
        var subscriptions = _context.Subscriptions
            .Where(x => x.TierId == tierId);
        _context.Subscriptions.RemoveRange(subscriptions);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteSubscription(int subscriptionId)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(x => x.Id == subscriptionId);
        if (subscription != null)
        {
            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Subscription?> GetSubscription(int subscriptionId)
    {
        return await _context.Subscriptions
            .Where(x => x.Id == subscriptionId)
            .Select(x => x.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<Subscription?> GetSubscriptionOfProfileIdInArtist(int profileId, int artistId)
    {
        return await _context.Subscriptions
            .Include(x => x.Tier)
            .Where(x => x.Tier.ProfileId == artistId)
            .Select(x => x.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<List<Subscription>> GetSubscriptions(int profileId)
    {
        return await _context.Subscriptions
            .Where(x => x.ProfileId == profileId)
            .Select(x => x.ConvertToDto())
            .ToListAsync();
    }
}

