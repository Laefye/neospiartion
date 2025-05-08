using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IMessageRepository
{
    Task<Message> CreateMessage(int senderId, int receiverId, string text, int? commissionId);
    Task<Message?> GetMessage(int messageId);
    Task<List<Message>> GetMessages(int profileId, int otherProfileId, int limit, int offset);
    Task<List<Conversation>> GetConversations(int profileId, int limit, int offset);
}
