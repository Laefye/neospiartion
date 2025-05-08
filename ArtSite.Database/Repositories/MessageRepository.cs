using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class MessageRepository(ApplicationDbContext context) : IMessageRepository
{
    public async Task<Message> CreateMessage(int senderId, int receiverId, string text, int? commissionId)
    {
        var message = new DbMessage
        {
            Text = text,
            CommissionId = commissionId,
            SenderId = senderId,
            ReceiverId = receiverId,
            CreatedAt = DateTime.UtcNow
        };
        context.Messages.Add(message);
        await context.SaveChangesAsync();
        return message.ConvertToDto();
    }

    public async Task<List<Conversation>> GetConversations(int profileId, int limit, int offset)
    {
        return await context.Messages
            .Where(m => m.SenderId == profileId || m.ReceiverId == profileId)
            .GroupBy(m => m.SenderId == profileId ? m.ReceiverId : m.SenderId)
            .Select(g => new Conversation
            {
                ProfileId = g.Key,
                LastMessageId = g.OrderByDescending(m => m.CreatedAt).FirstOrDefault()!.Id,
            })
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Message?> GetMessage(int messageId)
    {
        return await context.Messages
            .Where(m => m.Id == messageId)
            .Select(m => m.ConvertToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<List<Message>> GetMessages(int profileId, int otherProfileId, int limit, int offset)
    {
        return await context.Messages
            .Where(m => (m.SenderId == profileId && m.ReceiverId == otherProfileId) ||
                        (m.SenderId == otherProfileId && m.ReceiverId == profileId))
            .OrderByDescending(m => m.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(m => m.ConvertToDto())
            .ToListAsync();
    }
}
