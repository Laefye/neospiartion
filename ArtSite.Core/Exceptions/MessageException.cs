using System;

namespace ArtSite.Core.Exceptions;

public class MessageException : Exception
{
    public MessageException(string message) : base(message)
    {
    }

    public class NotFound : MessageException
    {
        public NotFound() : base("Message not found")
        {
        }
    }

    public class NotOwner : MessageException
    {
        public NotOwner() : base("You are not the owner of this message")
        {
        }
    }

    public class SelfMessage : MessageException
    {
        public SelfMessage() : base("You cannot send a message to yourself")
        {
        }
    }

    public class NotFoundCommission : MessageException
    {
        public NotFoundCommission() : base("Commission not found")
        {
        }
    }
}
