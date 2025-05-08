using System;

namespace ArtSite.Core.Interfaces;

public interface IFile
{
    string MimeType { get; }
    Stream Stream { get; }
}
