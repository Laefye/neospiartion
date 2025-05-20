namespace ArtSite.Core.Exceptions;

public class ProfileException(string message) : Exception(message) {
    public class NotFoundProfile : ProfileException
    {
        public NotFoundProfile() : base("Profile not found") { }
    }


    public class NotOwnerProfile : ProfileException
    {
        public NotOwnerProfile() : base("User does not have enough rights to access this profile") { }
    }

    public class NotFoundAvatar : ProfileException
    {
        public NotFoundAvatar() : base("Avatar not found") { }
    }
}