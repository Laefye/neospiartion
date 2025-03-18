using ArtSite.Core.Models;
using ArtSite.Database.Models;

namespace ArtSite.Services.Interfaces;

public interface IArtistService
{
    public Task<Artist> CreateArtist(string name);
    public Task<List<Art>> GetArts(int artistId);
    public Task<Art> CreateArt(int artistId, string description, List<string> photos);
    Task<Art> ImportArt(int artistId, ExportedArt exportedArt);
    public Task<List<Picture>> GetPictures(int artId);
}