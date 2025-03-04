using System.Buffers.Text;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ArtSite.Core.Utilities;
using ArtSite.VK.DTO;
using ArtSite.VK.Exceptions;
using ArtSite.VK.Interfaces;

namespace ArtSite.VK;

public class VKAuth : IVKAuth
{
    private const string _baseAuthorizationUrl = "https://id.vk.com/authorize";
    private const string _baseOauthUrl = "https://id.vk.com/oauth2/auth";
    private readonly string _clientId;
    private readonly HttpClient _httpClient;
    private readonly string _redirectUri;

    public VKAuth(HttpClient httpClient, string clientId, string redirectUri)
    {
        _httpClient = httpClient;
        _clientId = clientId;
        _redirectUri = redirectUri;
    }

    public async Task<IVKClient> Authenticate(string code, string codeVerifier, string deviceId, string state)
    {
        var authRequest = new AuthQuery
        {
            ClientId = _clientId,
            Code = code,
            CodeVerifier = codeVerifier,
            DeviceId = deviceId,
            RedirectUri = _redirectUri,
            State = state
        };
        var response = await PostForm(_baseOauthUrl, authRequest.Query);
        var oauth = await ParseAuthResponse<AuthenticateResult>(response);
        return CreateClient(oauth.AccessToken);
    }

    public string CreateAuthorizationUrl(string codeVerifier, string state)
    {
        var query = new Dictionary<string, string>
        {
            { "response_type", "code" },
            { "client_id", _clientId },
            { "code_challenge", Hash(codeVerifier) },
            { "code_challenge_method", "S256" },
            { "redirect_uri", _redirectUri },
            { "state", state }
        };
        return _baseAuthorizationUrl + "?" + QueryBuilder.Create(query);
    }

    private string Hash(string codeVerifier)
    {
        var hasher = SHA256.Create();
        var hash = hasher.ComputeHash(Encoding.ASCII.GetBytes(codeVerifier));
        return Base64Url.EncodeToString(hash);
    }

    private async Task<HttpResponseMessage> PostForm(string uri, string data)
    {
        var content = new StringContent(data);
        content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
        return await _httpClient.PostAsync(uri, content);
    }

    private async Task<T> ParseAuthResponse<T>(HttpResponseMessage response)
    {
        var json = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(json);
        if (jsonDoc.RootElement.TryGetProperty("error", out var errorElement) &&
            jsonDoc.RootElement.TryGetProperty("error_description", out var errorDescriptionElement))
        {
            var error = errorElement.GetString() ?? "unknown";
            var errorDescription = errorDescriptionElement.GetString() ?? "Unknown error";
            throw new VKAuthException(error, errorDescription);
        }

        return JsonSerializer.Deserialize<T>(json) ?? throw new VKException("Invalid response format");
    }

    public IVKClient CreateClient(string accessToken)
    {
        return new VKClient(_httpClient, accessToken);
    }
}