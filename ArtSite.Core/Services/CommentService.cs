using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUserService _userService;
    private readonly IArtService _artService;

    public CommentService(ICommentRepository commentRepository, IUserService userService, IArtService artService)
    {
        _commentRepository = commentRepository;
        _userService = userService;
        _artService = artService;
    }

    public async Task<Comment> CreateComment(string userId, int artId, string text)
    {
        var profile = await _userService.FindProfile(userId);
        var art = await _artService.GetArt(userId, artId);
        var comment = await _commentRepository.CreateComment(text, artId, profile.Id);
        return comment;
    }

    public async Task DeleteComment(string userId, int id)
    {
        var comment = await GetComment(id);
        var profile = await _userService.FindProfile(userId);
        if (comment.ProfileId != profile.Id)
            throw new CommentException.NotOwnerComment();
        await _commentRepository.DeleteComment(comment.Id);
    }

    public async Task ForceDeleteAllComments(int artId)
    {
        await _commentRepository.DeleteAllComments(artId);
    }

    public async Task<Comment> GetComment(int id)
    {
        var comment = await _commentRepository.GetComment(id);
        if (comment == null)
            throw new CommentException.NotFoundComment();
        return comment;
    }

    public Task<int> GetCommentCount(int artId)
    {
        return _commentRepository.GetCommentCount(artId);
    }

    public async Task<Countable<Comment>> GetComments(string? userId, int artId, int offset, int limit)
    {
        var art = await _artService.GetArt(userId, artId);
        return await _commentRepository.GetComments(art.Id, offset, limit);
    }
}
