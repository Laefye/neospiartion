using ArtSite.Core.DTO;

namespace ArtSite.Core.Interfaces.Services;

public interface IImportService
{
    Task<List<Art>> Import(int artistId, IPlatformArtExporter exporter);
}