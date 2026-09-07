namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class BoolExtensionsSteps(BoolExtensionsContext context)
{
    [Given("the boolean true")]
    public void GivenTheBooleanTrue() => context.Input = true;

    [Given("the boolean false")]
    public void GivenTheBooleanFalse() => context.Input = false;

    [When("Chuck Norris decides")]
    public void WhenChuckNorrisDecides()
        => context.Result = context.Input.ChuckNorrisDecides();

    [When("I check if the boolean is Chuck Norris approved")]
    public void WhenICheckIfChuckNorrisApproved()
        => context.Result = context.Input.IsChuckNorrisApproved();

    [When("I roundhouse kick the boolean")]
    public void WhenIRoundHouseKickTheBoolean()
        => context.Result = context.Input.RoundHouseKick();

    [Then("the bool result should be true")]
    public void ThenTheBoolResultShouldBeTrue()
        => context.Result.Should().BeTrue();

    [Then("the bool result should be false")]
    public void ThenTheBoolResultShouldBeFalse()
        => context.Result.Should().BeFalse();
}
