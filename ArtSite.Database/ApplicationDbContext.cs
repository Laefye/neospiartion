using ArtSite.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ArtSite.Database;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<DbArt> Arts { get; set; }
    public DbSet<DbPicture> Pictures { get; set; }
    public DbSet<DbMessage> Messages { get; set; }
    public DbSet<DbComment> Comments { get; set; }
    public DbSet<DbProfile> Profiles { get; set; }
    public DbSet<DbTier> Tiers { get; set; }
    public DbSet<DbSubscription> Subscriptions { get; set; }
    public DbSet<DbStoragedFile> StoragedFiles { get; set; }
    public DbSet<DbCommission> Commissions { get; set; }
    public DbSet<DbLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("pg_trgm");
        modelBuilder.Entity<DbProfile>()
            .HasIndex(p => p.DisplayName)
            .HasMethod("gin")
            .HasOperators("gin_trgm_ops");
    }
}