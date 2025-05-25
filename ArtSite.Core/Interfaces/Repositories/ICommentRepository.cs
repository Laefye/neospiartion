using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface ICommentRepository
{
    Task<Comment> CreateComment(string text, int artId, int profileId);
    Task<Comment?> GetComment(int id);
    Task<List<Comment>> GetComments(int artId, int offset, int limit);
    Task DeleteComment(int id);
    Task DeleteAllComments(int artId);
    Task<int> GetCommentCount(int artId);
}
