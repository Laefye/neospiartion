using ArtSite.Core.Utilities;

namespace ArtSite.VK.DTO;

public class MethodQuery
{
    public string AccessToken { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public Dictionary<string, string> Arguments { get; set; } = new();


    public string Query
    {
        get
        {
            Dictionary<string, string> query = new Dictionary<string, string>
            {
                { "access_token", AccessToken },
                { "v", Version }
            };
            foreach (var param in Arguments) query.Add(param.Key, param.Value);
            return QueryBuilder.Create(query);
        }
    }
}