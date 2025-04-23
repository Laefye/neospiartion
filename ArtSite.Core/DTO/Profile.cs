using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Profile
{
    public int Id { get; init; }
    public required string DisplayName { get; init; }
    public required string UserId { get; init; }
}