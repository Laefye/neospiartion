using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class TierRepository(ApplicationDbContext context) : ITierRepository
{
    public async Task<Tier> CreateTier(string name, string description, int artistId, int price, int? extends)
    {
        var entry = await context.Tiers.AddAsync(new DbTier
        {
            Name = name,
            Description = description,
            Price = price,
            ProfileId = artistId,
            Extends = extends
        });
        await context.SaveChangesAsync();
        return entry.Entity.ConvertToDto();
    }

    public async Task<Tier?> GetTier(int id)
    {
        var tier = await context.Tiers.FindAsync(id);
        return tier?.ConvertToDto();
    }

    public async Task<List<Tier>> GetTiersByArtist(int artistId)
    {
        var tiers = await context.Tiers
            .Where(t => t.ProfileId == artistId)
            .ToListAsync();
        return tiers.Select(t => t.ConvertToDto()).ToList();
    }

    public async Task UpdateTier(Tier tier)
    {
        var dbTier = await context.Tiers.FindAsync(tier.Id);
        if (dbTier != null)
        {
            dbTier.Name = tier.Name;
            dbTier.Description = tier.Description;
            dbTier.Price = tier.Price;
            dbTier.Extends = tier.Extends;
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteTier(int id)
    {
        var tier = await context.Tiers.FindAsync(id);
        if (tier != null)
        {
            context.Tiers.Remove(tier);
            await context.SaveChangesAsync();
        }
    }
}