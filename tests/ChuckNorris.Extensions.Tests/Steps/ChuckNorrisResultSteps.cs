namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class ChuckNorrisResultSteps(ChuckNorrisResultContext context)
{
    private Action? _act;

    [Given("a successful string result with value {string}")]
    public void GivenASuccessfulStringResult(string value)
        => context.StringResult = ChuckNorrisResult<string>.Success(value);

    [Given("a failed string result")]
    public void GivenAFailedStringResult()
        => context.StringResult = ChuckNorrisResult<string>.Failure();

    [Given("a failed string result with reason {string}")]
    public void GivenAFailedStringResultWithReason(string reason)
        => context.StringResult = ChuckNorrisResult<string>.Failure(reason);

    [When("I access the value of the failed result")]
    public void WhenIAccessValueOnFailure()
        => _act = () => _ = context.StringResult.Value;

    [Then("the result should be successful")]
    public void ThenResultIsSuccessful()
        => context.StringResult.IsSuccess.Should().BeTrue();

    [Then("the result value should be {string}")]
    public void ThenResultValueIs(string expected)
        => context.StringResult.Value.Should().Be(expected);

    [Then("the result should be a failure")]
    public void ThenResultIsFailure()
        => context.StringResult.IsFailure.Should().BeTrue();

    [Then("the result error should not be empty")]
    public void ThenResultErrorNotEmpty()
        => context.StringResult.Error.Should().NotBeEmpty();

    [Then("the result error should contain {string}")]
    public void ThenResultErrorContains(string expected)
        => context.StringResult.Error.Should().Contain(expected);

    [Then("an InvalidOperationException should be thrown on value access")]
    public void ThenInvalidOperationExceptionThrown()
        => _act.Should().Throw<InvalidOperationException>();
}
