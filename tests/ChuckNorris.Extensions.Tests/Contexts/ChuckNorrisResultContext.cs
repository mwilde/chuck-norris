namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class ChuckNorrisResultContext
{
    public ChuckNorrisResult<string> StringResult { get; set; } = ChuckNorrisResult<string>.Success(string.Empty);

    public ChuckNorrisResult<int> IntResult { get; set; } = ChuckNorrisResult<int>.Success(0);
}
