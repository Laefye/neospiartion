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

    public DbSet<DbArtist> Artists { get; set; }
    public DbSet<DbArt> Arts { get; set; }
    public DbSet<DbPicture> Pictures { get; set; }
}