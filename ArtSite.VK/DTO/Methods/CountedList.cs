using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class CountedList<T>
{
    [JsonPropertyName("count")] public int Count { get; set; }

    [JsonPropertyName("items")] public List<T> Items { get; set; } = new();
}