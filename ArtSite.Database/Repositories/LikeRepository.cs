using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class LikeRepository : ILikeRepository
{
    private readonly ApplicationDbContext _context;

    public LikeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task DeleteAllLikesInArt(int artId)
    {
        var likes = await _context.Likes
            .Where(l => l.ArtId == artId)
            .ToListAsync();
        if (likes.Any())
        {
            _context.Likes.RemoveRange(likes);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteLike(int profileId, int artId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.ProfileId == profileId && l.ArtId == artId);

        if (like != null)
        {
            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetLikes(int artId)
    {
        return await _context.Likes.CountAsync(l => l.ArtId == artId);
    }

    public async Task<bool> IsLiked(int profileId, int artId)
    {
        return await _context.Likes.AnyAsync(l => l.ProfileId == profileId && l.ArtId == artId);
    }

    public async Task SetLike(int profileId, int artId)
    {
        var exists = await _context.Likes
            .AnyAsync(l => l.ProfileId == profileId && l.ArtId == artId);

        if (!exists)
        {
            var like = new DbLike
            {
                ProfileId = profileId,
                ArtId = artId
            };
            _context.Likes.Add(like);
            await _context.SaveChangesAsync();
        }
    }
}
