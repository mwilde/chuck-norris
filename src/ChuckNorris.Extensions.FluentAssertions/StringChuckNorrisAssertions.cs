using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed string assertions.
/// </summary>
public class StringChuckNorrisAssertions : StringAssertions
{
    private readonly AssertionChain _chain;
    private readonly string? _subject;

    /// <summary>Initializes a new instance of <see cref="StringChuckNorrisAssertions"/>.</summary>
    public StringChuckNorrisAssertions(string? subject, AssertionChain chain)
        : base(subject!, chain)
    {
        _chain = chain;
        _subject = subject;
    }

    /// <summary>Asserts that the string survives Chuck Norris — non-null, non-empty, non-whitespace.</summary>
    public AndConstraint<StringChuckNorrisAssertions> SurviveChuckNorris(string because = "", params object[] becauseArgs)
    {
        _chain
            .ForCondition(!string.IsNullOrWhiteSpace(_subject))
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the string to survive Chuck Norris (be non-null and non-whitespace){{reason}}, but it did not.");

        return new AndConstraint<StringChuckNorrisAssertions>(this);
    }

    /// <summary>Asserts that the string does NOT survive Chuck Norris — null, empty, or whitespace.</summary>
    public AndConstraint<StringChuckNorrisAssertions> NotSurviveChuckNorris(string because = "", params object[] becauseArgs)
    {
        _chain
            .ForCondition(string.IsNullOrWhiteSpace(_subject))
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the string to not survive Chuck Norris (be null or whitespace){{reason}}, but it did.");

        return new AndConstraint<StringChuckNorrisAssertions>(this);
    }
}
