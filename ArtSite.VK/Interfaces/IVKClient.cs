using ArtSite.VK.DTO.Methods;

namespace ArtSite.VK.Interfaces;

public interface IVKClient
{
    string AccessToken { get; }
    Task<CountedList<Post>> GetPosts(long ownerId, long count, long offset);
    Task<CountedList<Group>> GetGroups(long userId);
}