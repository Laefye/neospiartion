namespace ArtSite.VK.Interfaces;

public interface IVKAuth
{
    Task<IVKClient> Authenticate(string code, string codeVerifier, string deviceId, string state);

    /// <summary>
    ///     Ссылку необходимо генерировать только на front
    /// </summary>
    /// <param name="codeVerifier"></param>
    /// <param name="state"></param>
    /// <returns></returns>
    string CreateAuthorizationUrl(string codeVerifier, string state);

    IVKClient CreateClient(string accessToken);
}