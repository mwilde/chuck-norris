namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class ExceptionExtensionsSteps(ExceptionExtensionsContext context)
{
    [Given("an exception with message {string}")]
    public void GivenAnExceptionWithMessage(string message)
        => context.Input = new Exception(message);

    [Given("a DivideByZeroException")]
    public void GivenADivideByZeroException()
        => context.Input = new DivideByZeroException();

    [When("Chuck Norris throws it")]
    public void WhenChuckNorrisThrowsIt()
        => context.ExceptionResult = context.Input.ChuckNorrisThrew();

    [When("I check if it was roundhouse kicked")]
    public void WhenICheckIfRoundHouseKicked()
        => context.BoolResult = context.Input.WasRoundHouseKicked();

    [When("Chuck Norris shouts the exception")]
    public void WhenChuckNorrisShoutsIt()
        => context.StringResult = context.Input.Shout();

    [Then("the wrapped exception message should contain {string}")]
    public void ThenWrappedMessageContains(string expected)
        => context.ExceptionResult.Message.Should().Contain(expected);

    [Then("the wrapped exception inner message should be {string}")]
    public void ThenWrappedInnerMessageIs(string expected)
        => context.ExceptionResult.InnerException!.Message.Should().Be(expected);

    [Then("the exception bool result should be true")]
    public void ThenExceptionBoolTrue()
        => context.BoolResult.Should().BeTrue();

    [Then("the exception bool result should be false")]
    public void ThenExceptionBoolFalse()
        => context.BoolResult.Should().BeFalse();

    [Then("the exception string result should be {string}")]
    public void ThenExceptionStringResultIs(string expected)
        => context.StringResult.Should().Be(expected);
}
