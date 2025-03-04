using ArtSite.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Artist> Artists { get; set; }
    public DbSet<Art> Arts { get; set; }
    public DbSet<Picture> Pictures { get; set; }
}