using ArtSite.Exceptions;
using ArtSite.Services.Interfaces;
using ArtSite.VK;
using ArtSite.VK.DTO.Methods;
using ArtSite.VK.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace ArtSite.Controllers;

[ApiController]
[Route("[controller]")]
public class VkController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IImportService _importService;
    private readonly IVKService _vkService;

    public VkController(IVKService vkService, IImportService importService, HttpClient httpClient)
    {
        _vkService = vkService;
        _importService = importService;
        _httpClient = httpClient;
    }

    private Exception HandleException(Exception e)
    {
        switch (e)
        {
            case VKCallMethodException vkCallMethodException:
                return new ApiException("vk_call_method", vkCallMethodException.Message, StatusCodes.Status400BadRequest);
            case VKAuthException vkAuthException:
                return new ApiException("vk_auth", vkAuthException.Error, StatusCodes.Status400BadRequest);
            default:
                return e;
        }
    }

    private async Task<T> CallService<T>(Func<Task<T>> serviceCall)
    {
        try
        {
            return await serviceCall();
        }
        catch (Exception e)
        {
            throw HandleException(e);
        }
    }


    [HttpGet("authorizationUrl")]
    public ActionResult<string> GetUser([FromQuery] string codeVerifier, [FromQuery] string state)
    {
        return _vkService.GetAuthorizationUrl(codeVerifier, state);
    }

    [HttpGet("authenticate")]
    public async Task<ActionResult<string>> GetAccessToken([FromQuery] string uri, [FromQuery] string codeVerifier)
    {
        return await CallService(async () =>
        {
            var parsedUri = new Uri(uri);
            var query = QueryHelpers.ParseQuery(parsedUri.Query);
            var code = query["code"];
            var deviceId = query["device_id"];
            var state = query["state"];
            var accessToken = await _vkService.AuthenticateCode(code, codeVerifier, deviceId, state);
            return accessToken;
        });
    }

    [HttpGet("groups")]
    public async Task<ActionResult<CountedList<Group>>> GetGroups([FromQuery] string accessToken,
        [FromQuery] long userId)
    {
        return await CallService(async () => await _vkService.GetGroups(accessToken, userId));
    }

    [HttpGet("posts")]
    public async Task<ActionResult<CountedList<Post>>> GetPosts([FromQuery] string accessToken,
        [FromQuery] long ownerId)
    {
        return await CallService(async () => await _vkService.GetPosts(accessToken, ownerId));
    }

    [HttpGet("exportArts")]
    public async Task<ActionResult> ExportArts([FromQuery] string accessToken, [FromQuery] long ownerId,
        [FromQuery] int artistId)
    {
        return await CallService(async () =>
        {
            var exporter = new VKWall(new VKClient(_httpClient, accessToken), ownerId, "User");
            await _importService.Import(artistId, exporter);
            return Ok();
        });
    }
}