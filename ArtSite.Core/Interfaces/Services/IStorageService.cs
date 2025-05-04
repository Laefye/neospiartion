using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Interfaces.Services;

public interface IStorageService
{
    Task<string> CreateFile();

    Task<Stream> OpenFile(string uri, FileAccess fileMode);

    void DeleteFile(string uri);
}
