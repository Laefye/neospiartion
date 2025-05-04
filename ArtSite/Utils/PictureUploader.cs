using System;
using ArtSite.Core.Interfaces;

namespace ArtSite.Utils;

public class PictureUploader : IPictureUploader
{
    private readonly IFormFile _file;

    public PictureUploader(IFormFile file)
    {
        _file = file;
    }

    public string MimeType => _file.ContentType;

    public void Upload(Stream stream)
    {
        _file.CopyTo(stream);
    }
}
