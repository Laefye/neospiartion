using System.Text.Json.Serialization;

namespace ArtSite.VK.DTO;

public class AuthenticateResult
{
    [JsonPropertyName("access_token")] public required string AccessToken { get; set; }

    [JsonPropertyName("user_id")] public required long UserId { get; set; }
}