using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class ImportService : IImportService
{
    private readonly IOldArtService _artService;

    public ImportService(IOldArtService artService)
    {
        _artService = artService;
    }

    public async Task<List<Art>> Import(int artistId, IPlatformArtExporter exporter)
    {
        var exportedArts = await exporter.ExportArts();
        var arts = new List<Art>();
        foreach (var exportedArt in exportedArts) arts.Add(await _artService.ImportArt(artistId, exportedArt));
        return arts;
    }
}