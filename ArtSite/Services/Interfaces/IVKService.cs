using ArtSite.VK.DTO.Methods;

namespace ArtSite.Services.Interfaces;

public interface IVKService
{
    Task<string> AuthenticateCode(string code, string codeVerifier, string deviceId, string state);

    string GetAuthorizationUrl(string codeVerifier, string state);

    Task<CountedList<Group>> GetGroups(string accessToken, long userId);

    Task<CountedList<Post>> GetPosts(string accessToken, long ownerId, long count = 100, long offset = 0);
}