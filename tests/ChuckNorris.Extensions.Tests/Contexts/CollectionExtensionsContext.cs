namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class CollectionExtensionsContext
{
    public List<string> List { get; set; } = [];

    public List<string> OriginalList { get; set; } = [];

    public List<string?> NullableList { get; set; } = [];

    public IList<string>? ShuffledList { get; set; }

    public IEnumerable<string>? FilteredList { get; set; }

    public string? PickedItem { get; set; }

    public int CountResult { get; set; }

    public Exception? ThrownException { get; set; }
}
