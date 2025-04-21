using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class ProfileRepository(ApplicationDbContext context) : IProfileRepository
{
    public Task<Profile?> GetProfile(int id)
    {
        return context.Profiles
            .Where(profile => profile.Id == id)
            .Select(profile => profile.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public Task<Profile?> GetProfileByUserId(string userId)
    {
        return context.Profiles
            .Where(profile => profile.UserId == userId)
            .Select(profile => profile.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<Profile> CreateProfile(string userId, string username, string name)
    {
        var entry = await context.Profiles.AddAsync(new DbProfile
        {
            Username = username,
            UserId = userId,
            Name = name,
        });
        await context.SaveChangesAsync();
        return entry.Entity.ConvertToDto();
    }

    public Task UpdateProfile(Profile profile)
    {
        var dbProfile = new DbProfile
        {
            Id = profile.Id,
            Username = profile.Username,
            UserId = profile.UserId,
            Name = profile.Name,
        };
        context.Profiles.Update(dbProfile);
        return context.SaveChangesAsync();
    }

    public async Task DeleteProfile(int id)
    {
        var profile = await context.Profiles.FindAsync(id);
        if (profile != null)
        {
            context.Profiles.Remove(profile);
            await context.SaveChangesAsync();
        }
    }
}