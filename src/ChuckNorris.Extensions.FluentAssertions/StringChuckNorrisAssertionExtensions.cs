using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed FluentAssertions extensions for strings.
/// Call via <c>"hello".Should().SurviveChuckNorris()</c>.
/// </summary>
public static class StringChuckNorrisAssertionExtensions
{
    /// <summary>
    /// Asserts that the string survives Chuck Norris — non-null, non-empty, non-whitespace.
    /// </summary>
    public static AndConstraint<StringAssertions> SurviveChuckNorris(
        this StringAssertions assertions,
        string because = "",
        params object[] becauseArgs)
    {
        using var scope = new AssertionScope();
        AssertionChain.GetOrCreate()
            .ForCondition(!string.IsNullOrWhiteSpace(assertions.Subject))
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the string to survive Chuck Norris (be non-null and non-whitespace){{reason}}, but it did not.");

        return new AndConstraint<StringAssertions>(assertions);
    }

    /// <summary>
    /// Asserts that the string does NOT survive Chuck Norris — null, empty, or whitespace.
    /// </summary>
    public static AndConstraint<StringAssertions> NotSurviveChuckNorris(
        this StringAssertions assertions,
        string because = "",
        params object[] becauseArgs)
    {
        AssertionChain.GetOrCreate()
            .ForCondition(string.IsNullOrWhiteSpace(assertions.Subject))
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the string to not survive Chuck Norris (be null or whitespace){{reason}}, but it did.");

        return new AndConstraint<StringAssertions>(assertions);
    }
}
