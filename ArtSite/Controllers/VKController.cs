using ArtSite.Exceptions;
using ArtSite.Services.Interfaces;
using ArtSite.VK;
using ArtSite.VK.DTO.Methods;
using ArtSite.VK.Exceptions;
using Microsoft.AspNetCore.Http.HttpResults;
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
    private readonly ILogger<VkController> _logger;

    public VkController(ILogger<VkController> logger, IVKService vkService, IImportService importService, HttpClient httpClient)
    {
        _vkService = vkService;
        _importService = importService;
        _httpClient = httpClient;
        _logger = logger;
    }

    private async Task<ActionResult> CallService(Func<Task<ActionResult>> serviceCall)
    {
        try
        {
            return await serviceCall();
        }
        catch (Exception e)
        {
            _logger.LogError(e, null);
            return Problem(null, null, StatusCodes.Status500InternalServerError);
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
            return Ok(accessToken);
        });
    }

    [HttpGet("groups")]
    public async Task<ActionResult<CountedList<Group>>> GetGroups([FromQuery] string accessToken,
        [FromQuery] long userId)
    {
        return await CallService(async () => Ok(await _vkService.GetGroups(accessToken, userId)));
    }

    [HttpGet("posts")]
    public async Task<ActionResult<CountedList<Post>>> GetPosts([FromQuery] string accessToken,
        [FromQuery] long ownerId)
    {
        return await CallService(async () => Ok(await _vkService.GetPosts(accessToken, ownerId)));
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