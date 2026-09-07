using FluentAssertions.Execution;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Provides the <c>Should()</c> entry point for Chuck Norris boolean assertions.
/// </summary>
public static class BoolChuckNorrisExtensions
{
    /// <summary>Returns a <see cref="BoolChuckNorrisAssertions"/> for the given boolean.</summary>
    public static BoolChuckNorrisAssertions Should(this bool subject)
        => new(subject, AssertionChain.GetOrCreate());
}
