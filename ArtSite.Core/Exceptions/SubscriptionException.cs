using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Exceptions;

public class SubscriptionException(string message) : Exception(message)
{
    public class ItsYou : SubscriptionException
    {
        public ItsYou()
            : base("Can't subscribe on you") { }
    }
}

