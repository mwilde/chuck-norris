namespace ChuckNorris.Extensions;

using Microsoft.AspNetCore.Builder;

/// <summary>
/// Extension method to register Chuck Norris middleware. One line. That's all Chuck Norris needs.
/// </summary>
public static class ChuckNorrisMiddlewareExtensions
{
    /// <summary>
    /// Adds Chuck Norris middleware to the pipeline.
    /// Every response will contain a <c>X-Chuck-Norris-Fact</c> header.
    /// </summary>
    /// <param name="app">The application builder.</param>
    /// <returns>The same <see cref="IApplicationBuilder"/> for chaining.</returns>
    /// <example>
    /// <code>
    /// app.UseChuckNorris();
    /// </code>
    /// </example>
    public static IApplicationBuilder UseChuckNorris(this IApplicationBuilder app)
        => app.UseMiddleware<ChuckNorrisMiddleware>();
}
