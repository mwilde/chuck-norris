using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Numeric;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed integer assertions.
/// </summary>
public class IntChuckNorrisAssertions : NumericAssertions<int>
{
    private readonly AssertionChain _chain;

    /// <summary>Initializes a new instance of <see cref="IntChuckNorrisAssertions"/>.</summary>
    public IntChuckNorrisAssertions(int subject, AssertionChain chain)
        : base(subject, chain)
    {
        _chain = chain;
    }

    /// <summary>Asserts that the integer is Chuck Norris approved — which it always is.</summary>
    public AndConstraint<IntChuckNorrisAssertions> BeChuckNorrisApproved(string because = "", params object[] becauseArgs)
    {
        _chain
            .ForCondition(true)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the integer to be Chuck Norris approved{{reason}}.");

        return new AndConstraint<IntChuckNorrisAssertions>(this);
    }
}
