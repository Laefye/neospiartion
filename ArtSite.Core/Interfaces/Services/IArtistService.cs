using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtistService
{
    Task<Artist> CreateArtist(int profileId);
    Task<Artist?> GetArtistByProfileId(int profileId);
    Task<Artist?> GetArtist(int id);
    Task<List<Art>> GetArts(int artistId);
}