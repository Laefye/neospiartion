using System.Text.Json.Serialization;
using ArtSite.Core.Exceptions;

namespace ArtSite.Controllers;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApiException e)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new Data
            {
                Error = e.Error,
                Message = e.Message
            });
        }
    }

    private class Data
    {
        [JsonPropertyName("error")] public required string Error { get; set; }

        [JsonPropertyName("message")] public required string Message { get; set; }
    }
}