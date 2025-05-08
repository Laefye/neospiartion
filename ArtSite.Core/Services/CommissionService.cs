using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class CommissionService : ICommissionService
{
    private readonly ICommissionRepository _commissionRepository;
    private readonly IStorageService _storageService;
    private readonly IProfileService _profileService;

    public CommissionService(ICommissionRepository commissionRepository, IProfileService profileService, IStorageService storageService)
    {
        _storageService = storageService;
        _commissionRepository = commissionRepository;
        _profileService = profileService;
    }

    public async Task<Commission> CreateCommission(string userId, int profileId, string name, string description, int price)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        if (profile.Id != profileId)
            throw new CommissionException.NotOwner();
        var commission = await _commissionRepository.CreateCommission(name, description, profile.Id, price);
        return commission;
    }

    public async Task DeleteCommission(string userId, int id)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        if (commission.ProfileId != profile.Id)
            throw new CommissionException.NotOwner();
        if (commission.Image != null)
        {
            var file = await _storageService.Apply(_profileService).GetFile(commission.Image.Value);
            await _storageService.DeleteFile(userId, file.Id);
        }
        await _commissionRepository.DeleteCommission(commission.Id);
    }

    public async Task DeleteImage(string userId, int id)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        if (commission.ProfileId != profile.Id)
            throw new CommissionException.NotOwner();
        if (commission.Image != null)
        {
            var file = await _storageService.Apply(_profileService).GetFile(commission.Image.Value);
            await _storageService.DeleteFile(userId, file.Id);
        }
        commission.Image = null;
        await _commissionRepository.UpdateCommission(commission);
    }

    public async Task<Commission> GetCommission(int id)
    {
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        return commission;
    }

    public async Task<List<Commission>> GetCommissionsByProfileId(int profileId)
    {
        var commissions = await _commissionRepository.GetCommissionsByProfileId(profileId);
        return commissions;
    }

    public async Task<IFile> GetImage(int id)
    {
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        if (commission.Image == null)
            throw new CommissionException.NotFoundImage();
        var file = await _storageService.Apply(_profileService).OpenFile(commission.Image.Value);
        return file;
    }

    public async Task UpdateCommission(string userId, int id, string name, string description, int price)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        if (commission.ProfileId != profile.Id)
            throw new CommissionException.NotOwner();
        commission.Name = name;
        commission.Description = description;
        commission.Price = price;
        await _commissionRepository.UpdateCommission(commission);
    }

    public async Task UpdateImage(string userId, int id, IFileUploader fileUploader)
    {
        var profile = await _profileService.GetProfileByUserId(userId);
        var commission = await _commissionRepository.GetCommission(id);
        if (commission == null)
            throw new CommissionException.NotFound();
        if (commission.ProfileId != profile.Id)
            throw new CommissionException.NotOwner();
        if (commission.Image != null)
        {
            var oldFile = await _storageService.Apply(_profileService).GetFile(commission.Image.Value);
            await _storageService.DeleteFile(userId, oldFile.Id);
        }
        var file = await _storageService.Apply(_profileService).UploadFile(userId, fileUploader);
        commission.Image = file.Id;
        await _commissionRepository.UpdateCommission(commission);
    }
}
