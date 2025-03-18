using ArtSite.Services.Interfaces;
using ArtSite.VK;
using ArtSite.VK.DTO.Methods;
using ArtSite.VK.Interfaces;

namespace ArtSite.Services;

public class VKService : IVKService
{
    private readonly IVKAuth _vkAuth;

    public VKService(HttpClient httpClient, string clientId, string redirectUri)
    {
        _vkAuth = new VKAuth(httpClient, clientId, redirectUri);
    }

    public async Task<string> AuthenticateCode(string code, string codeVerifier, string deviceId, string state)
    {
        var client = await _vkAuth.Authenticate(code, codeVerifier, deviceId, state);
        return client.AccessToken;
    }

    public string GetAuthorizationUrl(string codeVerifier, string state)
    {
        return _vkAuth.CreateAuthorizationUrl(codeVerifier, state);
    }

    public async Task<CountedList<Group>> GetGroups(string accessToken, long userId)
    {
        return await _vkAuth.CreateClient(accessToken).GetGroups(userId);
    }

    public async Task<CountedList<Post>> GetPosts(string accessToken, long ownerId, long count = 100, long offset = 0)
    {
        return await _vkAuth.CreateClient(accessToken).GetPosts(ownerId, count, offset);
    }

    public static Func<IServiceProvider, VKService> CreateFactory(IConfiguration configuration)
    {
        var clientId = configuration["VK:ClientId"]!;
        var redirectUri = configuration["VK:RedirectUri"]!;
        return serviceProvider => new VKService(
            serviceProvider.GetService<HttpClient>()!,
            clientId,
            redirectUri
        );
    }
}