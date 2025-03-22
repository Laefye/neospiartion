﻿using ArtSite.Core.DTO;

namespace ArtSite.Database.Models;

public class DbArtist
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; }

    public Artist ConvertToDTO() => new Artist
    {
        Id = Id,
        Name = Name,
        CreatedAt = CreatedAt,
    };
}