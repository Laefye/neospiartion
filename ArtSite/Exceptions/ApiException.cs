namespace ArtSite.Exceptions;

public class ApiException : Exception
{
    public ApiException(string error, string message, int statusCode) : base(message)
    {
        Error = error;
        StatusCode = statusCode;
    }
    
    public int StatusCode { get; set; }

    public string Error { get; set; }
}