namespace ArtSite.Core.Exceptions;

public class ArtistException(string message) : Exception(message) {
    public class NotFoundArtist : ArtistException
    {
        public NotFoundArtist() : base("Artist not found") { }
    }

    public class NotArtist : ArtistException
    {
        public NotArtist() : base("You are not an artist") { }
    }
}