namespace ChuckNorris.Extensions;

using System.Net.Http.Json;
using System.Text.Json.Serialization;

/// <summary>
/// Chuck Norris doesn't need a database. These facts simply exist out of fear.
/// Fetches live facts from https://api.chucknorris.io — falls back to the built-in list when offline.
/// </summary>
public static class ChuckNorrisFacts
{
    private static readonly HttpClient HttpClient = new()
    {
        BaseAddress = new Uri("https://api.chucknorris.io/"),
        Timeout = TimeSpan.FromSeconds(3),
    };

    private static readonly string[] Facts =
    [
        "Chuck Norris can divide by zero.",
        "Chuck Norris doesn't call the database. The database calls Chuck Norris.",
        "Chuck Norris's code never throws exceptions. Exceptions are too afraid.",
        "Chuck Norris doesn't fix bugs. Bugs fix themselves in his presence.",
        "Chuck Norris can unit test production code — in production.",
        "Chuck Norris pushes directly to main. The pipeline passes out of fear.",
        "Chuck Norris doesn't need async/await. Everything runs synchronously out of respect.",
        "Chuck Norris doesn't write null checks. null checks itself.",
        "Chuck Norris's foreach loop runs backwards — and still works.",
        "When Chuck Norris throws an exception, it catches itself.",
        "Chuck Norris compiled his first program before the computer was turned on.",
        "Chuck Norris's code doesn't have comments. The code is too scared to be misunderstood.",
        "Chuck Norris uses 'goto' — and it works perfectly.",
        "Chuck Norris doesn't need dependency injection. Dependencies inject themselves.",
        "Chuck Norris can make a deadlock resolve itself.",
        "NuGet packages update themselves when Chuck Norris is nearby.",
        "Chuck Norris doesn't merge branches. Branches merge into Chuck Norris.",
        "Chuck Norris's stack never overflows. It just gets deeper out of respect.",
        "Chuck Norris doesn't need a garbage collector. Memory frees itself out of respect.",
        "Chuck Norris's code compiles on the first try. Always.",
        "Chuck Norris doesn't use version control. Files revert themselves if they displease him.",
        "Chuck Norris doesn't write switch statements. Cases surrender without being asked.",
        "Chuck Norris's regex matches everything, including regex itself.",
        "Chuck Norris doesn't await tasks. Tasks complete before he even asks.",
        "Chuck Norris can read binary with his eyes closed.",
    ];

    /// <summary>
    /// Returns a random fact from the built-in list.
    /// </summary>
    /// <returns>A random Chuck Norris fact string.</returns>
    public static string GetRandom() => Facts[Random.Shared.Next(Facts.Length)];

    /// <summary>
    /// Fetches a live random fact from the Chuck Norris API.
    /// Falls back to the built-in list if the API is unreachable.
    /// </summary>
    /// <returns>A Chuck Norris fact string.</returns>
    public static async Task<string> GetRandomAsync()
    {
        try
        {
            var response = await HttpClient.GetFromJsonAsync<ChuckNorrisApiResponse>("jokes/random");
            return response?.Value ?? GetRandom();
        }
        catch
        {
            // Chuck Norris doesn't need the internet. Neither do we.
            return GetRandom();
        }
    }

    /// <summary>Gets the complete built-in fact list.</summary>
    /// <value>A read-only list of all 25 built-in Chuck Norris facts.</value>
    public static IReadOnlyList<string> All => Facts;

    private sealed class ChuckNorrisApiResponse
    {
        [JsonPropertyName("value")]
        public string? Value { get; init; }
    }
}
