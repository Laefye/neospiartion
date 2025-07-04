﻿using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Repositories;

public interface IPictureRepository
{
    Task<Picture> AddPicture(int artId, int storagedFileId);

    Task<List<Picture>> GetPictures(int artId);

    Task<Picture?> GetPicture(int pictureId);

    Task DeletePicture(int artId);
}
