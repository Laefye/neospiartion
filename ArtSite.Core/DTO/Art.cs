﻿namespace ArtSite.Core.DTO;

public class Art
{
    public int Id { get; init; }
    public string? Description { get; init; }
    public DateTime UploadedAt { get; init; }
    public int ArtistId { get; init; }
}