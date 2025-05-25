using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class CommentRepository(ApplicationDbContext context) : ICommentRepository
{
    public async Task<Comment> CreateComment(string text, int artId, int profileId)
    {
        var comment = new DbComment
        {
            Text = text,
            ArtId = artId,
            ProfileId = profileId,
            UploadedAt = DateTime.UtcNow
        };
        
        context.Comments.Add(comment);
        await context.SaveChangesAsync();
        
        return comment.ConvertToDto();
    }

    public async Task DeleteAllComments(int artId)
    {
        var comments = await context.Comments
            .Where(c => c.ArtId == artId)
            .ToListAsync();
        context.Comments.RemoveRange(comments);
        await context.SaveChangesAsync();
    }

    public async Task DeleteComment(int id)
    {
        var comment = await context.Comments.FindAsync(id);
        if (comment == null) return;
        context.Comments.Remove(comment);
        await context.SaveChangesAsync();
    }

    public async Task<Comment?> GetComment(int id)
    {
        var comment = await context.Comments
            .FirstOrDefaultAsync(c => c.Id == id);
        return comment?.ConvertToDto();
    }

    public Task<int> GetCommentCount(int artId)
    {
        return context.Comments
            .CountAsync(c => c.ArtId == artId);
    }

    public async Task<List<Comment>> GetComments(int artId, int offset, int limit)
    {
        var comments = await context.Comments
            .Where(c => c.ArtId == artId)
            .OrderByDescending(c => c.UploadedAt)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
        return comments.Select(c => c.ConvertToDto()).ToList();
    }
}