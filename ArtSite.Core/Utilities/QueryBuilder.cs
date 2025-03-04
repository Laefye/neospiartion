namespace ArtSite.Core.Utilities;

public class QueryBuilder
{
    public static string Create(Dictionary<string, string> values)
    {
        return string.Join("&", values.Select(x => $"{x.Key}={Uri.EscapeDataString(x.Value)}"));
    }
}