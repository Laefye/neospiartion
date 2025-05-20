using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace ArtSite.Config;

public class JwtConfig
{
    public string Issuer { get; private set; }
    public string Audience { get; private set; }
    private string SecretKey { get; set; }

    public SymmetricSecurityKey SymmetricSecurityKey => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));

    public JwtConfig(IConfiguration configuration)
    {
        Issuer = configuration["JWT:Issuer"]!;
        Audience = configuration["JWT:Audience"]!;
        SecretKey = configuration["JWT:SecretKey"]!;
    }
}
