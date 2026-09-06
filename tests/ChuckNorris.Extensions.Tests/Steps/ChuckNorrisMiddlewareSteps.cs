namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.TestHost;
using Reqnroll;

[Binding]
public class ChuckNorrisMiddlewareSteps(ChuckNorrisMiddlewareContext context)
{
    [Given("a web application with Chuck Norris middleware")]
    public async Task GivenAWebApplicationWithChuckNorrisMiddleware()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();

        var app = builder.Build();
        app.UseChuckNorris();
        app.MapGet(
            "/{**path}",
            ctx =>
            {
                ctx.Response.StatusCode = 200;
                return Task.CompletedTask;
            });

        await app.StartAsync();
        context.Client = app.GetTestClient();
    }

    [When("a GET request is made to {string}")]
    public async Task WhenAGetRequestIsMadeTo(string path)
    {
        context.Response = await context.Client!.GetAsync(path);
    }

    [Then("the response should contain the header {string}")]
    public void ThenTheResponseShouldContainTheHeader(string headerName)
    {
        context.Response!.Headers.Contains(headerName).Should().BeTrue();
    }

    [Then("the {string} header value should not be empty")]
    public void ThenTheHeaderValueShouldNotBeEmpty(string headerName)
    {
        context.Response!.Headers.GetValues(headerName).FirstOrDefault()
            .Should().NotBeNullOrWhiteSpace();
    }
}
