using FluentAssertions.Execution;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Provides the <c>Should()</c> entry point for <see cref="ChuckNorrisResult{T}"/> assertions.
/// </summary>
public static class ChuckNorrisResultAssertionsExtensions
{
    /// <summary>Returns a <see cref="ChuckNorrisResultAssertions{T}"/> for the given result.</summary>
    public static ChuckNorrisResultAssertions<T> Should<T>(this ChuckNorrisResult<T> result)
        => new(result, AssertionChain.GetOrCreate());
}
