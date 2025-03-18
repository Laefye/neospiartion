namespace ArtSite.VK.Exceptions;

public class VKAuthException : VKException
{
    public VKAuthException(string error, string description) : base(description)
    {
        Error = error;
    }

    public string Error { get; private set; }
}