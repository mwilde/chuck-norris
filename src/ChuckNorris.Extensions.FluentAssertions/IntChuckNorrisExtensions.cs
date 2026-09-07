using FluentAssertions.Execution;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Provides the <c>Should()</c> entry point for Chuck Norris integer assertions.
/// </summary>
public static class IntChuckNorrisExtensions
{
    /// <summary>Returns an <see cref="IntChuckNorrisAssertions"/> for the given integer.</summary>
    public static IntChuckNorrisAssertions Should(this int subject)
        => new(subject, AssertionChain.GetOrCreate());
}
