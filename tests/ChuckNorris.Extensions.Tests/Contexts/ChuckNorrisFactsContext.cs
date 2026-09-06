namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class ChuckNorrisFactsContext
{
    public string? Fact { get; set; }

    public IReadOnlyList<string>? Facts { get; set; }
}
