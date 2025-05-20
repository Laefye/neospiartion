using System;
using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface IArtService
{
    IArtService Apply(ITierService tierService);
    IArtService Apply(ICommentService commentService);
    IArtService Apply(IView view);

    /// <summary>
    /// Создание нового произведения искусства.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя который вызывает.</param>
    /// <param name="profileId">Идентификатор художника.</param>
    /// <param name="description">Описание произведения искусства.</param>
    /// <param name="tierId">Идентификатор уровня доступа.</param>
    /// <returns>Созданное произведение искусства.</returns>
    Task<Art> CreateArt(string userId, int profileId, string? description, int? tierId);

    /// <summary>
    /// Возвращает все произведения искусства с заданным смещением и лимитом. (Систсема рекомендаций)
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="offset">Смещение.</param>
    /// <param name="limit">Лимит.</param>
    /// <returns>Список произведений искусства.</returns>
    Task<List<Art>> GetAllArts(string userId, int offset, int limit);

    /// <summary>
    /// Возвращает произведение искусства по идентификатору.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="artId">Идентификатор произведения искусства.</param>
    /// <returns>Произведение искусства.</returns>
    Task<Art> GetArt(string? userId, int artId);

    /// <summary>
    /// Возвращает список изображений для произведения искусства.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="artId">Идентификатор произведения искусства.</param>
    /// <returns>Список изображений.</returns>
    Task<List<Picture>> GetPictures(string? userId, int artId);

    /// <summary>
    /// Загружает изображение для произведения искусства.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="artId">Идентификатор произведения искусства.</param>
    /// <param name="pictureUploader">Загрузчик изображения.</param>
    /// <returns>Загруженное изображение.</returns>
    Task<Picture> UploadPicture(string userId, int artId, IFileUploader pictureUploader);

    /// <summary>
    /// Удаляет произведения искусства.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="artId">Идентификатор произведения искусства.</param>
    /// <returns>Удаленное изображение.</returns>
    Task DeleteArt(string userId, int artId);

    /// <summary>
    /// Получает изображение из произведения искусства.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <param name="pictureId">Идентификатор изображения.</param>
    /// <returns>Изображение.</returns>
    Task<Picture> GetPicture(string? userId, int pictureId);

    Task<IFile> GetPictureFile(string? userId, int pictureId);
}
