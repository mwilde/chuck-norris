namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class ExceptionExtensionsContext
{
    public Exception Input { get; set; } = new Exception("default error");

    public Exception ExceptionResult { get; set; } = new Exception();

    public bool BoolResult { get; set; }

    public string StringResult { get; set; } = string.Empty;
}
