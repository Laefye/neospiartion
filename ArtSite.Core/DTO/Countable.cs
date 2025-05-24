using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Countable<T>
{
   public int Count { get; init; }
   public required List<T> Items { get; init; }
}
