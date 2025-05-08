using System;

namespace ArtSite.Core.Exceptions;

public class CommissionException : Exception
{
    public CommissionException(string message) : base(message)
    {
    }

    public class NotFound : CommissionException
    {
        public NotFound() : base($"Commission not found.")
        {
        }
    }

    public class NotOwner : CommissionException
    {
        public NotOwner() : base($"You are not the owner of this commission.")
        {
        }
    }

    public class NotFoundImage : CommissionException
    {
        public NotFoundImage() : base($"Commission image not found.")
        {
        }
    }
}

