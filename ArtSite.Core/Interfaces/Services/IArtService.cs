using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtService
{
    Task<List<Art>> GetAllArts(int offset, int limit);

    Task<Art?> GetArt(int id);

    Task<List<Picture>> GetPicturesByArt(int artId);

    Task<Picture> AddPictureToArt(int artId, string url);
}
