namespace ChuckNorris.Extensions;

using Microsoft.AspNetCore.Http;

/// <summary>
/// ASP.NET Core middleware that injects Chuck Norris facts into every HTTP response.
/// Chuck Norris doesn't need middleware. Middleware needs Chuck Norris.
/// </summary>
public class ChuckNorrisMiddleware(RequestDelegate next)
{
    /// <summary>
    /// Invokes the middleware, injects the Chuck Norris fact header, and calls the next delegate.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.OnStarting(async () =>
        {
            var fact = await ChuckNorrisFacts.GetRandomAsync();
            context.Response.Headers["X-Chuck-Norris-Fact"] = fact;
        });

        await next(context);
    }
}
