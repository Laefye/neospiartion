using System;

namespace ArtSite.Core.Interfaces;

public interface IFileUploader
{
    string MimeType { get; }

    void Upload(Stream stream);
}
