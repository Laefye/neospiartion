using System.ComponentModel.DataAnnotations;

namespace ArtSite.DTO;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public required string Password { get; set; }
    
    [Required]
    public required string UserName { get; set; }

    [Required]
    public required string DisplayName { get; set; }
}

