namespace ArtSite.VK.Exceptions;

public class VKCallMethodException : VKException
{
    public VKCallMethodException(int errorCode, string errorMessage) : base(errorMessage)
    {
        ErrorCode = errorCode;
    }

    public int ErrorCode { get; private set; }
}