using ArtSite.Core.DTO;
using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtistService
{
    public Task<Artist> CreateArtist(string name);
    public Task<Artist?> GetArtist(int id);
    public Task<List<Art>> GetArts(int artistId);
    public Task<Art> CreateArt(int artistId, string description, List<string> photos);
    Task<Art> ImportArt(int artistId, ExportedArt exportedArt);
    public Task<List<Picture>> GetPictures(int artId);
}