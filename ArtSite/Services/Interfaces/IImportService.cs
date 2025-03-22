using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces;
using ArtSite.Database.Models;

namespace ArtSite.Services.Interfaces;

public interface IImportService
{
    Task<List<Art>> Import(int artistId, IPlatformArtExporter exporter);
}