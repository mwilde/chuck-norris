using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed boolean assertions.
/// </summary>
public class BoolChuckNorrisAssertions : BooleanAssertions
{
    private readonly AssertionChain _chain;

    /// <summary>Initializes a new instance of <see cref="BoolChuckNorrisAssertions"/>.</summary>
    public BoolChuckNorrisAssertions(bool subject, AssertionChain chain)
        : base(subject, chain)
    {
        _chain = chain;
    }

    /// <summary>Asserts that the boolean is Chuck Norris approved — i.e. it is <see langword="true"/>.</summary>
    public AndConstraint<BoolChuckNorrisAssertions> BeChuckNorrisApproved(string because = "", params object[] becauseArgs)
    {
        _chain
            .ForCondition(Subject == true)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the boolean to be Chuck Norris approved (true){{reason}}, but it was false.");

        return new AndConstraint<BoolChuckNorrisAssertions>(this);
    }
}
