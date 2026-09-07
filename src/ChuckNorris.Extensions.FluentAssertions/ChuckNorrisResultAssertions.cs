using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace ChuckNorris.Extensions.FluentAssertions;

/// <summary>
/// Chuck Norris-themed assertion class for <see cref="ChuckNorrisResult{T}"/>.
/// </summary>
public class ChuckNorrisResultAssertions<T> : ReferenceTypeAssertions<ChuckNorrisResult<T>, ChuckNorrisResultAssertions<T>>
{
    /// <summary>Initializes a new instance of <see cref="ChuckNorrisResultAssertions{T}"/>.</summary>
    public ChuckNorrisResultAssertions(ChuckNorrisResult<T> subject)
        : base(subject)
    {
    }

    /// <inheritdoc/>
    protected override string Identifier => "ChuckNorrisResult";

    /// <summary>Asserts that the result is successful.</summary>
    public AndConstraint<ChuckNorrisResultAssertions<T>> BeSuccessful(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .ForCondition(Subject.IsSuccess)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected {{context:ChuckNorrisResult}} to be successful{{reason}}, but it failed with: {Subject.Error}");

        return new AndConstraint<ChuckNorrisResultAssertions<T>>(this);
    }

    /// <summary>Asserts that the result is a failure.</summary>
    public AndConstraint<ChuckNorrisResultAssertions<T>> BeAFailure(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .ForCondition(Subject.IsFailure)
            .BecauseOf(because, becauseArgs)
            .FailWith($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — Expected {{context:ChuckNorrisResult}} to be a failure{{reason}}, but it was successful.");

        return new AndConstraint<ChuckNorrisResultAssertions<T>>(this);
    }
}
