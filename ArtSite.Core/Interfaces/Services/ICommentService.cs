using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface ICommentService
{
    Task<Comment> CreateComment(string userId, int artId, string text);
    Task<Comment> GetComment(int id);
    Task<List<Comment>> GetComments(string? userId, int artId, int offset, int limit);
    Task DeleteComment(string userId, int id);
    Task ForceDeleteAllComments(int artId);
    Task<int> GetCommentCount(int artId);
}
