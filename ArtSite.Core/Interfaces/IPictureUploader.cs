using System;

namespace ArtSite.Core.Interfaces;

public interface IPictureUploader
{
    string MimeType { get; }

    void Upload(Stream stream);
}
