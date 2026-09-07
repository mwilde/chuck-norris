using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed FluentAssertions extensions for booleans.
/// Call via <c>true.Should().BeChuckNorrisApproved()</c>.
/// </summary>
public static class BoolChuckNorrisAssertionExtensions
{
    /// <summary>
    /// Asserts that the boolean is Chuck Norris approved — i.e. it is <see langword="true"/>.
    /// </summary>
    public static AndConstraint<BooleanAssertions> BeChuckNorrisApproved(
        this BooleanAssertions assertions,
        string because = "",
        params object[] becauseArgs)
    {
        Execute.Assertion
            .ForCondition(assertions.Subject == true)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the boolean to be Chuck Norris approved (true){{reason}}, but it was false.");

        return new AndConstraint<BooleanAssertions>(assertions);
    }
}
