namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class DateTimeExtensionsSteps(DateTimeExtensionsContext context)
{
    [Given("the date {string}")]
    public void GivenTheDate(string date)
        => context.Input = DateTime.Parse(date, null, System.Globalization.DateTimeStyles.RoundtripKind);

    [When("I check if it is a Chuck Norris day")]
    public void WhenICheckIfChuckNorrisDay()
        => context.BoolResult = context.Input.IsChuckNorrisDay();

    [When("I check if Chuck Norris survived it")]
    public void WhenICheckIfChuckNorrisSurvivedIt()
        => context.BoolResult = context.Input.SurvivedChuckNorris();

    [When("I count roundhouse kicks since that date")]
    public void WhenICountRoundHouseKicks()
        => context.LongResult = context.Input.RoundHouseKicksSince();

    [Then("the datetime bool result should be true")]
    public void ThenDateTimeBoolResultTrue()
        => context.BoolResult.Should().BeTrue();

    [Then("the datetime bool result should be false")]
    public void ThenDateTimeBoolResultFalse()
        => context.BoolResult.Should().BeFalse();

    [Then("the roundhouse kick count should be {long}")]
    public void ThenRoundHouseKickCountShouldBe(long expected)
        => context.LongResult.Should().Be(expected);

    [Then("the roundhouse kick count should be positive")]
    public void ThenRoundHouseKickCountPositive()
        => context.LongResult.Should().BePositive();
}
