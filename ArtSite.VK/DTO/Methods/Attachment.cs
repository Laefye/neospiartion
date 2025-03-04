using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class Attachment
{
    [JsonPropertyName("type")] public required string Type { get; set; }

    [JsonPropertyName("photo")] public Photo? Photo { get; set; }
}