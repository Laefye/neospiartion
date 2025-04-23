using System.ComponentModel.DataAnnotations;

namespace ArtSite.DTO;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    
    [Required]
    public string UserName { get; set; }

    [Required]
    public string DisplayName { get; set; }
}

