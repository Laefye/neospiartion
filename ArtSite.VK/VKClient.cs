using System.Text.Json;
using ArtSite.VK.DTO;
using ArtSite.VK.DTO.Methods;
using ArtSite.VK.Exceptions;
using ArtSite.VK.Interfaces;
using Microsoft.AspNetCore.WebUtilities;

namespace ArtSite.VK;

public class VKClient : IVKClient
{
    private const string _version = "5.131";
    private const string _baseApiUrl = "https://api.vk.com/method/";
    private readonly HttpClient _httpClient;

    public VKClient(HttpClient httpClient, string accessToken)
    {
        _httpClient = httpClient;
        AccessToken = accessToken;
    }

    public string AccessToken { get; }

    public async Task<CountedList<Group>> GetGroups(long userId)
    {
        var response = await CallMethod<CountedList<Group>>("groups.get", new Dictionary<string, string>
        {
            { "extended", "1" },
            { "user_id", userId.ToString() }
        });
        return response;
    }

    public async Task<CountedList<Post>> GetPosts(long ownerId, long count = 100, long offset = 0)
    {
        var response = await CallMethod<CountedList<Post>>("wall.get", new Dictionary<string, string>
        {
            { "extended", "1" },
            { "owner_id", ownerId.ToString() },
            { "count", count.ToString() },
            { "offset", offset.ToString() }
        });
        return response;
    }

    private string GetMethodUrl(string method, Dictionary<string, string> query)
    {
        return QueryHelpers.AddQueryString($"{_baseApiUrl}{method}", query!);
    }

    private async Task<T> CallMethod<T>(string method, Dictionary<string, string> arguments)
    {
        var request = new MethodQuery
        {
            AccessToken = AccessToken,
            Arguments = arguments,
            Version = _version
        };
        var response = await _httpClient.GetAsync(GetMethodUrl(method, request.Query));
        var json = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(json);
        if (jsonDoc.RootElement.TryGetProperty("error", out var errorElement))
        {
            if (
                errorElement.ValueKind == JsonValueKind.Object &&
                errorElement.TryGetProperty("error_code", out var errorCodeElement) &&
                errorElement.TryGetProperty("error_msg", out var errorMsgElement)
            )
                throw new VKCallMethodException(
                    errorCodeElement.GetInt32(),
                    errorMsgElement.GetString()!
                );
            throw new VKException("Unknown error");
        }

        var methodResponse = JsonSerializer.Deserialize<MethodResponse<T>>(json);
        if (methodResponse == null || methodResponse.Response == null) throw new VKException("Invalid response format");
        return methodResponse.Response;
    }
}