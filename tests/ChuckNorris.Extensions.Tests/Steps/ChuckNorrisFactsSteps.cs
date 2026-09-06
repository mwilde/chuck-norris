namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class ChuckNorrisFactsSteps(ChuckNorrisFactsContext context)
{
    [When("I get a random Chuck Norris fact")]
    public void WhenIGetARandomFact()
    {
        context.Fact = ChuckNorrisFacts.GetRandom();
    }

    [When("I get a random Chuck Norris fact asynchronously")]
    public async Task WhenIGetARandomFactAsync()
    {
        context.Fact = await ChuckNorrisFacts.GetRandomAsync();
    }

    [When("I retrieve all Chuck Norris facts")]
    public void WhenIRetrieveAllFacts()
    {
        context.Facts = ChuckNorrisFacts.All;
    }

    [Then("the fact should not be empty")]
    public void ThenTheFactShouldNotBeEmpty()
    {
        context.Fact.Should().NotBeNullOrWhiteSpace();
    }

    [Then("the list should not be empty")]
    public void ThenTheListShouldNotBeEmpty()
    {
        context.Facts.Should().NotBeEmpty();
    }

    [Then("every fact in the list should be non-empty")]
    public void ThenEveryFactShouldBeNonEmpty()
    {
        context.Facts.Should().AllSatisfy(f => f.Should().NotBeNullOrWhiteSpace());
    }
}
