using System.Text.Json.Serialization;
using ArtSite.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace ArtSite.Controllers;

public class ExceptionHandler : IExceptionHandler
{
    public ExceptionHandler()
    {
        
    }

    private class Data
    {
        [JsonPropertyName("error")] public required string Error { get; set; }

        [JsonPropertyName("message")] public required string Message { get; set; }
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is ApiException apiException)
        {
            httpContext.Response.StatusCode = apiException.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(new Data
            {
                Error = apiException.Error,
                Message = apiException.Message
            }, cancellationToken: cancellationToken);
            return true;
        }
        return false;
    }
}