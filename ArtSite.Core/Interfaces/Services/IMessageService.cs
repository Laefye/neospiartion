using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface IMessageService
{
    IMessageService Apply(ICommissionService commissionService);
    Task<Message> CreateMessage(string userId, int receiverId, string text, int? commissionId);
    Task<Message> GetMessage(string userId, int messageId);
    Task<List<Message>> GetMessages(string userId, int receiverId, int limit, int offset);
    Task<List<Conversation>> GetConversations(string userId, int profileId, int limit, int offset);
}
