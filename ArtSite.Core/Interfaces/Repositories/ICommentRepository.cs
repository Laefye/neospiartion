using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ICommentRepository
{
    Task<Comment> CreateComment(string? text, int artId, int userId);
    Task<Comment?> GetComment(int id);
    Task<List<Comment>> GetComments(int artId, int offset, int limit);
}
