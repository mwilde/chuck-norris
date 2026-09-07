namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class CollectionExtensionsSteps(CollectionExtensionsContext context)
{
    [Given("a list with errors {string}, {string}, {string}")]
    public void GivenAListWithErrors(string e1, string e2, string e3)
    {
        context.List = [e1, e2, e3];
    }

    [Given("a list with items {string}, {string}, {string}")]
    public void GivenAListWithItems(string i1, string i2, string i3)
    {
        context.OriginalList = [i1, i2, i3];
        context.List = [i1, i2, i3];
    }

    [Given("a list with a single item {string}")]
    public void GivenAListWithASingleItem(string item)
    {
        context.OriginalList = [item];
        context.List = [item];
    }

    [Given("an empty list")]
    public void GivenAnEmptyList()
    {
        context.List = [];
    }

    [Given("a nullable list with values {string}, null, {string}, null, {string}")]
    public void GivenANullableListWithNulls(string v1, string v2, string v3)
    {
        context.NullableList = [v1, null, v2, null, v3];
    }

    [Given("a nullable list with values {string}, {string}, {string}")]
    public void GivenANullableListWithValues(string v1, string v2, string v3)
    {
        context.NullableList = [v1, v2, v3];
    }

    [When("I call SurvivedChuckNorris")]
    public void WhenICallSurvivedChuckNorris()
    {
        context.List.SurvivedChuckNorris();
    }

    [When("I call ChuckNorrisPick")]
    public void WhenICallChuckNorrisPick()
    {
        try
        {
            context.PickedItem = context.List.ChuckNorrisPick();
        }
        catch (InvalidOperationException ex)
        {
            context.ThrownException = ex;
        }
    }

    [When("I call ChuckNorrisShuffle")]
    public void WhenICallChuckNorrisShuffle()
    {
        context.ShuffledList = context.List.ChuckNorrisShuffle();
    }

    [When("I call SurviveChuckNorris on the nullable list")]
    public void WhenICallSurviveChuckNorrisOnTheNullableList()
    {
        context.FilteredList = context.NullableList.SurviveChuckNorris();
    }

    [When("I call ChuckNorrisCount")]
    public void WhenICallChuckNorrisCount()
    {
        context.CountResult = context.List.ChuckNorrisCount();
    }

    [Then("the list should be empty")]
    public void ThenTheListShouldBeEmpty()
    {
        context.List.Should().BeEmpty();
    }

    [Then("the picked item should be in the original list")]
    public void ThenThePickedItemShouldBeInTheOriginalList()
    {
        context.OriginalList.Should().Contain(context.PickedItem);
    }

    [Then("the picked item should be {string}")]
    public void ThenThePickedItemShouldBe(string expected)
    {
        context.PickedItem.Should().Be(expected);
    }

    [Then("an InvalidOperationException should be thrown")]
    public void ThenAnInvalidOperationExceptionShouldBeThrown()
    {
        context.ThrownException.Should().BeOfType<InvalidOperationException>();
    }

    [Then("the shuffled list should contain all original items")]
    public void ThenTheShuffledListShouldContainAllOriginalItems()
    {
        context.ShuffledList.Should().BeEquivalentTo(context.OriginalList);
    }

    [Then("the shuffled list should contain {string}")]
    public void ThenTheShuffledListShouldContain(string expected)
    {
        context.ShuffledList.Should().Contain(expected);
    }

    [Then("the filtered list should contain {string}, {string}, {string}")]
    public void ThenTheFilteredListShouldContain(string v1, string v2, string v3)
    {
        context.FilteredList.Should().BeEquivalentTo([v1, v2, v3]);
    }

    [Then("the filtered list should have {int} elements")]
    public void ThenTheFilteredListShouldHaveElements(int count)
    {
        context.FilteredList.Should().HaveCount(count);
    }

    [Then("the count result should be {int}")]
    public void ThenTheCountResultShouldBe(int expected)
    {
        context.CountResult.Should().Be(expected);
    }
}
