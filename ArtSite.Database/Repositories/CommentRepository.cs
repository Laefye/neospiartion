using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class CommentRepository : ICommentRepository
{
    private ApplicationDbContext _context;
    public CommentRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<Comment> CreateComment(string? text, int artId, int userId)
    {
        var comment = new Comment
        {
            Content = text ?? string.Empty,
            Profile = new Profile { Id = userId },
            ArtId = artId,
            UploadedAt = DateTime.UtcNow
        };
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();
        return comment;
    }
    public async Task<Comment?> GetComment(int id)
    {
        return await _context.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task<List<Comment>> GetComments(int artId, int offset, int limit)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Where(c => c.ArtId == artId)
            .OrderByDescending(c => c.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }
}