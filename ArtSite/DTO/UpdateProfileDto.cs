using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.DTO;

public class UpdateProfileDto
{
    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string Description { get; set; }
}
