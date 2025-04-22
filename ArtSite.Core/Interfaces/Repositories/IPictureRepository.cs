using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IPictureRepository
{
    Task<Picture> AddPicture(int artId, string url);

    Task<List<Picture>> GetPictures(int artId);
}
