using System;

namespace ArtSite.Core.Exceptions;

public class ArtException(string message) : Exception(message)
{
    public class UnauthorizedArtistAccess : ArtException
    {
        public UnauthorizedArtistAccess() 
            : base("User does not have enough rights to access this artist") { }
    }

    public class NotFoundArt : ArtException
    {
        public NotFoundArt() 
            : base("Art not found") { }
    }

    public class NotFoundPicture : ArtException
    {
        public NotFoundPicture() 
            : base("Picture not found") { }
    }
}
