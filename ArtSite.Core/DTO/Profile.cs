using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Core.DTO;

public class Profile
{
    public int Id { get; set; }
    public required string DisplayName { get; set; }
    public required string UserId { get; set; }
    public int? Avatar { get; set; }
}