using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArtSite.Core.Interfaces.Services;

namespace ArtSite.Core.Services;

public class StorageService : IStorageService
{
    public async Task<string> CreateFile()
    {
        var guid = Guid.NewGuid().ToString();
        if (!Directory.Exists("Uploads"))
            Directory.CreateDirectory("Uploads");

        var fileName = Path.Combine("Uploads", guid);

        File.Create(fileName).Close();

        return "fs://local/" + guid;
    }

    public async Task<Stream> OpenFile(string uri, FileAccess fileAccess)
    {
        if (!uri.StartsWith("fs://local/"))
            throw new ArgumentException("Invalid URI format", nameof(uri));

        var guid = uri.Substring("fs://local/".Length);
        var filePath = Path.Combine("Uploads", guid);

        if (!File.Exists(filePath))
            throw new FileNotFoundException("File not found", filePath);
        
        return new FileStream(
            filePath,
            FileMode.Open,
            fileAccess,
            FileShare.None,
            bufferSize: 4096,
            useAsync: true
        );
    }
}
