using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class CommissionRepository(ApplicationDbContext context) : ICommissionRepository
{
    public async Task<Commission> CreateCommission(string name, string description, int profileId, int price)
    {
        var commission = new DbCommission
        {
            Name = name,
            Description = description,
            ProfileId = profileId,
            Price = price,
            CreatedAt = DateTime.UtcNow
        };
        await context.Commissions.AddAsync(commission);
        await context.SaveChangesAsync();
        return commission.ConvertToDto();
    }

    public async Task DeleteCommission(int id)
    {
        var commission = await context.Commissions.FindAsync(id);
        if (commission != null)
        {
            context.Commissions.Remove(commission);
            await context.SaveChangesAsync();
        }
    }

    public async Task<Commission?> GetCommission(int id)
    {
        return await context.Commissions
            .Where(c => c.Id == id)
            .Select(c => c.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<List<Commission>> GetCommissionsByProfileId(int profileId)
    {
        return await context.Commissions
            .Where(c => c.ProfileId == profileId)
            .Select(c => c.ConvertToDto())
            .ToListAsync();
    }

    public async Task UpdateCommission(Commission commission)
    {
        var dbCommission = await context.Commissions.FindAsync(commission.Id);
        if (dbCommission != null)
        {
            dbCommission.Name = commission.Name;
            dbCommission.Description = commission.Description;
            dbCommission.Price = commission.Price;
            dbCommission.ProfileId = commission.ProfileId;
            dbCommission.Image = commission.Image;
            await context.SaveChangesAsync();
        }
    }
}
