using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed FluentAssertions extensions for <see cref="ChuckNorrisResult{T}"/>.
/// Usage: <c>result.ChuckShould().BeSuccessful()</c>
/// </summary>
public static class ChuckNorrisResultAssertionExtensions
{
    /// <summary>
    /// Returns a <see cref="ChuckNorrisResultAssertions{T}"/> for the given result.
    /// Named <c>ChuckShould</c> to avoid ambiguity with the standard FluentAssertions <c>Should()</c>.
    /// </summary>
    public static ChuckNorrisResultAssertions<T> ChuckShould<T>(this ChuckNorrisResult<T> result)
        => new(result);
}
