using System;
using ArtSite.Core.DTO;
using ArtSite.Core.Interfaces;

namespace ArtSite.Core;

public class StoragedFileStream : IFile
{
    private readonly StoragedFile _file;
    private readonly Stream _stream;

    public StoragedFileStream(StoragedFile file, Stream stream)
    {
        _file = file;
        _stream = stream;
    }

    public string MimeType => _file.MimeType;

    public Stream Stream => _stream;
}
