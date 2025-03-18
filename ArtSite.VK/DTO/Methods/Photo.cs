using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class Photo
{
    [JsonPropertyName("id")] public required long Id { get; set; }

    [JsonPropertyName("sizes")] public required List<Size> Sizes { get; set; }

    [JsonPropertyName("orig_photo")] public Size? OriginalPhoto { get; set; }

    public class Size
    {
        [JsonPropertyName("type")] public required string Type { get; set; }

        [JsonPropertyName("url")] public required string Url { get; set; }

        [JsonPropertyName("width")] public required int Width { get; set; }

        [JsonPropertyName("height")] public required int Height { get; set; }
    }
}