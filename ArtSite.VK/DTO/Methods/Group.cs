using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class Group
{
    [JsonPropertyName("id")] public int Id { get; set; }

    [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;

    [JsonPropertyName("screen_name")] public string ScreenName { get; set; } = string.Empty;

    [JsonPropertyName("photo_50")] public string? Photo { get; set; } = null;
}