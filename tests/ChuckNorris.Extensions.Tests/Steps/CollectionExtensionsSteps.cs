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
}
