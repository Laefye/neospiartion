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
    public async Task<Comment> AddComment(Comment comment)
    {
        var dbComment = new DbComment
        {
            Content = comment.Text,
            CreatedAt = DateTime.UtcNow,
            ArtId = comment.ArtId,
            ProfileID = comment.ProfileId
        };
        await _context.Comments.AddAsync(dbComment);
        await _context.SaveChangesAsync();
        return dbComment.ConvertToDTO();
    }
    public async Task<List<Comment>> GetComments(int artId)
    {
        var comments = await _context.Comments
            .Where(c => c.ArtId == artId)
            .Include(c => c.Profile)
            .ToListAsync();
        return comments.Select(c => c.ConvertToDTO()).ToList();
    }
}