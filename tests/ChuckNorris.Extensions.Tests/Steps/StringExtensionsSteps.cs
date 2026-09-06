namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class StringExtensionsSteps(StringExtensionsContext context)
{
    [Given("the string {string}")]
    public void GivenTheString(string value)
    {
        context.Input = value;
    }

    [Given("a null string")]
    public void GivenANullString()
    {
        context.Input = null;
    }

    [When("I apply RoundHouseKick")]
    public void WhenIApplyRoundHouseKick()
    {
        context.StringResult = context.Input!.RoundHouseKick();
    }

    [When("I check if it survives Chuck Norris")]
    public void WhenICheckSurvives()
    {
        context.BoolResult = context.Input.SurvivesChuckNorris();
    }

    [When("I apply ChuckNorrisApproved")]
    public void WhenIApplyChuckNorrisApproved()
    {
        context.StringResult = context.Input!.ChuckNorrisApproved();
    }

    [Then("the result should be {string}")]
    public void ThenTheResultShouldBe(string expected)
    {
        context.StringResult.Should().Be(expected);
    }

    [Then("the result should be true")]
    public void ThenTheResultShouldBeTrue()
    {
        context.BoolResult.Should().BeTrue();
    }

    [Then("the result should be false")]
    public void ThenTheResultShouldBeFalse()
    {
        context.BoolResult.Should().BeFalse();
    }

    [Then("the result should contain {string}")]
    public void ThenTheResultShouldContain(string expected)
    {
        context.StringResult.Should().Contain(expected);
    }
}
