using FluentAssertions.Execution;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Provides the <c>Should()</c> entry point for Chuck Norris string assertions.
/// </summary>
public static class StringChuckNorrisExtensions
{
    /// <summary>Returns a <see cref="StringChuckNorrisAssertions"/> for the given string.</summary>
    public static StringChuckNorrisAssertions Should(this string? subject)
        => new(subject, AssertionChain.GetOrCreate());
}
