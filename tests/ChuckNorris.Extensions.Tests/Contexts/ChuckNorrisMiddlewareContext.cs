namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class ChuckNorrisMiddlewareContext
{
    public HttpClient? Client { get; set; }

    public HttpResponseMessage? Response { get; set; }
}
