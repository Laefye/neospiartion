using System;

namespace ArtSite.Core.Exceptions;

public class StorageException : Exception
{
    public StorageException(string message) : base(message)
    {
    }

    public class FileNotFound : StorageException
    {
        public FileNotFound() : base("File not found")
        {
        }
    }

    public class NotOwner : StorageException
    {
        public NotOwner() : base("You are not the owner of this file")
        {
        }
    }
}
