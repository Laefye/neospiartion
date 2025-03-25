using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Services;

public class ImportService : IImportService
{
    private readonly IArtistService _artistService;

    public ImportService(IArtistService artistService)
    {
        _artistService = artistService;
    }

    public async Task<List<Art>> Import(int artistId, IPlatformArtExporter exporter)
    {
        var exportedArts = await exporter.ExportArts();
        var arts = new List<Art>();
        foreach (var exportedArt in exportedArts) arts.Add(await _artistService.ImportArt(artistId, exportedArt));
        return arts;
    }
}