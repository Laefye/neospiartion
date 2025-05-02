using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtistService
{
    public Task<Artist> CreateArtist(int profileId);
    public Task<Artist?> GetArtist(int id);
    public Task<Artist?> GetArtistByProfileId(int profileId);
}