using System;

namespace ArtSite.Core.Exceptions;

public class TierException : Exception
{
    public class NotFoundTier : Exception
    {
        public NotFoundTier() : base("Tier not found")
        {
        }
    }

    public class NotOwnerTier : Exception
    {
        public NotOwnerTier() : base("You are not the owner of this tier")
        {
        }
    }

    public class NotFoundAvatar : Exception
    {
        public NotFoundAvatar() : base("Avatar not found")
        {
        }
    }
}
