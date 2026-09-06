namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class CollectionExtensionsContext
{
    public List<string> List { get; set; } = [];

    public List<string> OriginalList { get; set; } = [];

    public string? PickedItem { get; set; }

    public Exception? ThrownException { get; set; }
}
