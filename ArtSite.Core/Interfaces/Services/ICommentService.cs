using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface ICommentService
{
    Task<Comment> CreateComment(string? text, int artId, int userId);
    Task<Comment?> GetComment(int id);
    Task<List<Comment>> GetComments(int artId, int offset, int limit);
}
