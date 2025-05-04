using System;

namespace ArtSite.Core.Exceptions;

public class CommentException : Exception
{
    public class NotFoundComment : Exception {
        public NotFoundComment() :
            base("Not found comment") {}
    }

    public class NotOwnerComment : Exception {
        public NotOwnerComment() :
            base("Not owner comment") {}
    }
}
