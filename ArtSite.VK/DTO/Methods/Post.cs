using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class Post
{
    [JsonPropertyName("text")] public required string Text { get; set; }

    [JsonPropertyName("type")] public required string Type { get; set; }

    [JsonPropertyName("date")] public required long Date { get; set; }

    [JsonPropertyName("id")] public required long Id { get; set; }

    [JsonPropertyName("is_pinned")] public int? IsPinned { get; set; }

    [JsonPropertyName("attachments")] public List<Attachment>? Attachments { get; set; }
}