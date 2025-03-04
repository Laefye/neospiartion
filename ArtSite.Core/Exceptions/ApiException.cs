namespace ArtSite.Core.Exceptions;

public class ApiException : Exception
{
    public ApiException(string error, string message) : base(message)
    {
        Error = error;
    }

    public string Error { get; set; }
}