using ArtSite.Core.DTO;
using ArtSite.Core.Models;
using Microsoft.AspNetCore.Http;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtService
{
    Task<Art> CreateArt(int artistId, string? description, List<string> pictures);
    Task<Art> CreateArt(int artistId, string? description);
    Task<Art> ImportArt(int artistId, ExportedArt exportedArt);
    Task<Picture> AddPictureToArt(int artId, IFormFile file, string mimeType);
    Task<List<Art>> GetAllArts(int offset, int limit);
    Task<Art?> GetArt(int id);
    Task<List<Art>> GetArtsByArtist(int artistId);
    Task<List<Picture>> GetPicturesByArt(int artId);
    Task<Picture?> GetPicture(int pictureId);
    Task DeleteArt(int artId);
}