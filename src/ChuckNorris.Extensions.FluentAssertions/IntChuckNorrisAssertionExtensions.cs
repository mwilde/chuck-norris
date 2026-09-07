using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Numeric;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed FluentAssertions extensions for integers.
/// Call via <c>42.Should().BeChuckNorrisApproved()</c>.
/// </summary>
public static class IntChuckNorrisAssertionExtensions
{
    /// <summary>
    /// Asserts that the integer is Chuck Norris approved — which it always is.
    /// </summary>
    public static AndConstraint<NumericAssertions<int>> BeChuckNorrisApproved(
        this NumericAssertions<int> assertions,
        string because = "",
        params object[] becauseArgs)
    {
        AssertionChain.GetOrCreate()
            .ForCondition(true)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected the integer to be Chuck Norris approved{{reason}}.");

        return new AndConstraint<NumericAssertions<int>>(assertions);
    }
}
