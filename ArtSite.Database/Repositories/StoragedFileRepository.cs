using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database.Repositories;

public class StoragedFileRepository(ApplicationDbContext context) : IStoragedFileRepository
{
    public async Task<StoragedFile> Add(int profileId, string mimeType, string url)
    {
        var file = new DbStoragedFile
        {
            ProfileId = profileId,
            MimeType = mimeType,
            CreatedAt = DateTime.UtcNow,
            Url = url,
        };
        await context.StoragedFiles.AddAsync(file);
        await context.SaveChangesAsync();
        return file.ConvertToDto();
    }

    public async Task Delete(int id)
    {
        var file = await context.StoragedFiles.FindAsync(id);
        if (file != null)
        {
            context.StoragedFiles.Remove(file);
            await context.SaveChangesAsync();
        }
    }

    public async Task<StoragedFile?> GetById(int id)
    {
        return await context.StoragedFiles
            .Where(file => file.Id == id)
            .Select(file => file.ConvertToDto())
            .FirstOrDefaultAsync();
    }
}
