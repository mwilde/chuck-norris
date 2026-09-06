namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class IntExtensionsSteps(IntExtensionsContext context)
{
    [Given("the integer {int}")]
    public void GivenTheInteger(int value)
    {
        context.Input = value;
    }

    [When("I check if it is Chuck Norris approved")]
    public void WhenICheckApproved()
    {
        context.BoolResult = context.Input.IsChuckNorrisApproved();
    }

    [Then("it should be Chuck Norris approved")]
    public void ThenItShouldBeChuckNorrisApproved()
    {
        context.BoolResult.Should().BeTrue();
    }

    [When("I divide it by zero")]
    public void WhenIDivideByZero()
    {
        context.DoubleResult = context.Input.DivideByZero();
    }

    [Then("the result should be positive infinity")]
    public void ThenTheResultShouldBePositiveInfinity()
    {
        context.DoubleResult.Should().Be(double.PositiveInfinity);
    }
}
