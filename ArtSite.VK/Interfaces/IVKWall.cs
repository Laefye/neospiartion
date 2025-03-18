namespace ArtSite.VK.Interfaces;

public interface IVKWall
{
    public enum VKWallType
    {
        User,
        Group
    }

    VKWallType Type { get; }

    string Name { get; }
}