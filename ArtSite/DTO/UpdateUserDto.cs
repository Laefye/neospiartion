using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.DTO;

public class UpdateUserDto
{
    [Required]
    public required string UserName { get; set; }
}
