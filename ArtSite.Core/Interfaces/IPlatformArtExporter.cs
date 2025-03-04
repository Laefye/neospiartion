using ArtSite.Core.Models;

namespace ArtSite.Core.Interfaces;

public interface IPlatformArtExporter
{
    /// <summary>
    ///     Возвращает список экспортированных артов
    /// </summary>
    /// <returns>Список артов</returns>
    Task<List<ExportedArt>> ExportArts();
}