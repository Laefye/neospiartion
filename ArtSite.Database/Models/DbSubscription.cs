using ArtSite.Core.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArtSite.Database.Models;

public class DbSubscription
{
    public int Id { get; set; }
    public required int ProfileId { get; set; }
    public int TierId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public DbTier Tier { get; set; } = null!;

    public Subscription ConvertToDto() => new Subscription
    {
        Id = Id,
        ProfileId = ProfileId,
        CreatedAt = CreatedAt,
        ExpiresAt = ExpiresAt,
        TierId = TierId,
    };
}

