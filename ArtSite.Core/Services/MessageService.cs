using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class MessageService : IMessageService
{
    private readonly IProfileService _profileService;
    private readonly IMessageRepository _messageRepository;
    private ICommissionService _commissionService = null!;

    public MessageService(IMessageRepository messageRepository, IProfileService profileService)
    {
        _messageRepository = messageRepository;
        _profileService = profileService;
    }


    public IMessageService Apply(ICommissionService commissionService)
    {
        _commissionService = commissionService;
        return this;
    }

    public async Task<Message> CreateMessage(string userId, int receiverId, string text, int? commissionId)
    {
        var sender = await _profileService.GetProfileByUserId(userId);
        var receiver = await _profileService.GetProfile(receiverId);
        if (sender.Id == receiver.Id)
            throw new MessageException.SelfMessage();
        if (commissionId != null)
        {
            var commission = await _commissionService.GetCommission(commissionId.Value);
            if (commission == null || commission.ProfileId != receiver.Id)
                throw new MessageException.NotFoundCommission();
        }
        var message = await _messageRepository.CreateMessage(sender.Id, receiver.Id, text, commissionId);
        return message;   
    }

    public async Task<List<Conversation>> GetConversations(string userId, int profileId, int limit, int offset)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        if (profile.Id != profileId)
            throw new MessageException.NotOwner();
        return await _messageRepository.GetConversations(profile.Id, limit, offset);
    }

    public async Task<Message> GetMessage(string userId, int messageId)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var message = await _messageRepository.GetMessage(messageId);
        if (message == null || message.SenderId != profile.Id && message.ReceiverId != profile.Id)
            throw new MessageException.NotFound();
        return message;
    }

    public Task<List<Message>> GetMessages(string userId, int receiverId, int limit, int offset)
    {
        var profile = _profileService.GetProfileByUserId(userId).Result;
        if (profile.Id == receiverId)
            throw new MessageException.SelfMessage();
        return _messageRepository.GetMessages(profile.Id, receiverId, limit, offset);
    }
}
