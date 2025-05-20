using ArtSite.Core.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.Interfaces;

public interface IView
{
    Task<bool> CanView(string? userId, Art art);
}


