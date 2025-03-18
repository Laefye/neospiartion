namespace ArtSite.VK.DTO;

public class AuthQuery
{
    public string GrantType { get; set; } = "authorization_code";
    public required string Code { get; set; }
    public required string CodeVerifier { get; set; }
    public required string ClientId { get; set; }
    public required string DeviceId { get; set; }
    public required string RedirectUri { get; set; }
    public required string State { get; set; }

    public Dictionary<string, string> Query => new() {
        { "grant_type", GrantType },
        { "code", Code },
        { "code_verifier", CodeVerifier },
        { "client_id", ClientId },
        { "device_id", DeviceId },
        { "redirect_uri", RedirectUri },
        { "state", State }
    };
}