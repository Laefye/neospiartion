using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Policy;

public class ArtistRoleHandler : AuthorizationHandler<ArtistRoleRequirement>
{
    private readonly IUserService _userService;
    private readonly IArtistService _artistService;

    public ArtistRoleHandler(IUserService userService, IArtistService artistService)
    {
        _userService = userService;
        _artistService = artistService;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, ArtistRoleRequirement requirement)
    {
        IdentityUser user;
        try
        {
            user = await _userService.GetUserByClaims(context.User);
        }
        catch (UserException e)
        {
            context.Fail();
            return;
        }
        Profile profile = await _userService.FindProfile(user.Id);
        var artist = await _artistService.GetArtistByProfileId(profile.Id);
        if (artist == null)
        {
            context.Fail();
            return;
        }
        context.Succeed(requirement);
    }
}

