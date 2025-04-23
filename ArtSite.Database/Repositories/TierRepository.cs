using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class TierRepository(ApplicationDbContext context) : ITierRepository
{
    public async Task<Tier> CreateTier(string name, int artistId, int? extends)
    {
        throw new NotImplementedException();
        // var entry = await context.Tiers.AddAsync(new DbTier
        // {
        //     Name = name,
        //     ArtistId = artistId,
        //     Extends = extends
        // });
        // await context.SaveChangesAsync();
        // return entry.Entity.ConvertToDto();
    }

    public Task<Tier?> GetTier(int id)
    {
        throw new NotImplementedException();
        // return context.Tiers
        //     .Where(tier => tier.Id == id)
        //     .Select(tier => tier.ConvertToDto())
        //     .FirstOrDefaultAsync();
    }

    public Task<List<Tier>> GetTiersByArtist(int artistId)
    {
        throw new NotImplementedException();
        // return context.Tiers
        //     .Where(tier => tier.ArtistId == artistId)
        //     .Select(tier => tier.ConvertToDto())
        //     .ToListAsync();
    }

    public async Task UpdateTier(Tier tier)
    {
        throw new NotImplementedException();
        // var dbTier = new DbTier
        // {
        //     Id = tier.Id,
        //     Name = tier.Name,
        //     ArtistId = tier.ArtistId,
        //     Extends = tier.Extends
        // };
        // context.Tiers.Update(dbTier);
        // await context.SaveChangesAsync();
    }

    public async Task DeleteTier(int id)
    {
        throw new NotImplementedException();
        // var tier = await context.Tiers.FindAsync(id);
        // if (tier != null)
        // {
        //     context.Tiers.Remove(tier);
        //     await context.SaveChangesAsync();
        // }
    }
}