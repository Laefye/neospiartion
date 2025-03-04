using ArtSite.Core.Interfaces;
using ArtSite.Core.Models;
using ArtSite.VK.DTO.Methods;
using ArtSite.VK.Interfaces;

namespace ArtSite.VK;

public class VKWall : IPlatformArtExporter, IVKWall
{
    private const int _count = 100;
    private readonly long _ownerId;
    private readonly IVKClient _vkClient;

    public VKWall(IVKClient vkClient, long ownerId, string name)
    {
        _vkClient = vkClient;
        _ownerId = ownerId;
        Name = name;
    }

    public async Task<List<ExportedArt>> ExportArts()
    {
        var posts = new List<Post>();
        while (true)
        {
            var postsPart = await _vkClient.GetPosts(_ownerId, _count, posts.Count);
            posts.AddRange(postsPart.Items);
            if (posts.Count >= postsPart.Count) break;
        }

        return posts
            .Where(post => post.Attachments != null && post.Attachments.Count > 0 &&
                           post.Attachments.TrueForAll(attachment => attachment.Photo != null))
            .Select(post => new ExportedArt
            {
                Description = post.Text.Length == 0 ? null : post.Text,
                Pictures = post.Attachments!.Select(attachment => attachment.Photo!.OriginalPhoto!.Url).ToList(),
                UploadedDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddSeconds(post.Date)
            }).ToList();
    }

    public IVKWall.VKWallType Type => _ownerId > 0 ? IVKWall.VKWallType.User : IVKWall.VKWallType.Group;

    public string Name { get; }
}