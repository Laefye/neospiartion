using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO.Methods;

public class MethodResponse<T>
{
    [JsonPropertyName("response")] public T? Response { get; set; }
}