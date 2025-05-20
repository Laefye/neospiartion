using System;

namespace ArtSite.Core.Exceptions;

public class NotAppliedException : Exception
{
    public NotAppliedException(string clazz) : base($"{clazz} is not applied. Please call Apply method before using this service.")
    {

    }
}
