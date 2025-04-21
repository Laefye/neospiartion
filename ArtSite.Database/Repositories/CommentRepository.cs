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
            ProfileId = profileId,
            ArtId = artId,
            UploadedAt = DateTime.UtcNow
        };
        await context.Comments.AddAsync(comment);
        await context.SaveChangesAsync();
        return comment.ConvertToDto();
    }
    
    public async Task<Comment?> GetComment(int id)
    {
        return (await context.Comments.Where(comment => comment.Id == id).FirstOrDefaultAsync())?.ConvertToDto();
    }
    
    public async Task<List<Comment>> GetComments(int artId, int offset, int limit)
    {
        return await context.Comments
            .Where(comment => comment.ArtId == artId)
            .OrderByDescending(comment => comment.UploadedAt)
            .Skip(offset)
            .Take(limit)
            .Select(comment => comment.ConvertToDto())
            .ToListAsync();
    }
}