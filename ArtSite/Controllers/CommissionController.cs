using System.Security.Claims;
using ArtSite.Core.DTO;
using ArtSite.Core.Exceptions;
using ArtSite.Core.Interfaces.Services;
using ArtSite.DTO;
using ArtSite.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtSite.Controllers;


[Route("api/commissions")]
[ApiController]
public class CommissionController : ControllerBase
{
    private readonly ICommissionService _commissionService;

    public CommissionController(ICommissionService commissionService)
    {
        _commissionService = commissionService;
    }

    [HttpGet("{commissionId}")]
    [ProducesResponseType(typeof(Commission), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetCommission(int commissionId)
    {
        try {
            var commission = await _commissionService.GetCommission(commissionId);
            return Ok(commission);
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpGet("{commissionId}/image")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetImage(int commissionId)
    {
        try {
            var image = await _commissionService.GetImage(commissionId);
            return File(image.Stream, image.MimeType);
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (CommissionException.NotFoundImage e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpPost("{commissionId}/image")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UploadImage(int commissionId, IFormFile file)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _commissionService.UpdateImage(userId, commissionId, new FileUploader(file));
            return Accepted();
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (CommissionException.NotOwner e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpDelete("{commissionId}/image")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteImage(int commissionId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _commissionService.DeleteImage(userId, commissionId);
            return Accepted();
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (CommissionException.NotOwner e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpDelete("{commissionId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteCommission(int commissionId)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _commissionService.DeleteCommission(userId, commissionId);
            return Accepted();
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (CommissionException.NotOwner e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }

    [HttpPut("{commissionId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateCommission(int commissionId, CommissionDto commission)
    {
        try {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _commissionService.UpdateCommission(userId, commissionId, commission.Name, commission.Description, commission.Price);
            return Accepted();
        }
        catch (CommissionException.NotFound e)
        {
            return NotFound(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
        catch (CommissionException.NotOwner e)
        {
            return BadRequest(new ProblemDetails
            {
                Detail = e.Message,
            });
        }
    }
}
