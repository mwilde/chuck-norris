namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;

/// <summary>
/// Displays a random Chuck Norris fact. Fetches from the live API by default, falls back to the built-in list.
/// Chuck Norris doesn't need an API. APIs call him.
/// </summary>
public partial class ChuckNorrisFact : ComponentBase
{
    /// <summary>
    /// Gets or sets a value indicating whether to fetch from the live <c>https://api.chucknorris.io</c> API.
    /// Defaults to <c>true</c>. Falls back to the built-in fact list when offline.
    /// </summary>
    /// <value><c>true</c> to use the live API; <c>false</c> to use only the built-in list.</value>
    [Parameter]
    public bool UseLiveApi { get; set; } = true;

    /// <summary>Gets or sets a value indicating whether clicking the fact refreshes it. Defaults to <c>true</c>.</summary>
    /// <value><c>true</c> to enable click-to-refresh; <c>false</c> to render as static text.</value>
    [Parameter]
    public bool Refreshable { get; set; } = true;

    private string Fact { get; set; } = string.Empty;

    /// <inheritdoc />
    protected override async Task OnInitializedAsync() => await LoadFact();

    private async Task Refresh()
    {
        if (!Refreshable)
        {
            return;
        }

        await LoadFact();
    }

    private async Task LoadFact()
    {
        Fact = UseLiveApi
            ? await ChuckNorrisFacts.GetRandomAsync()
            : ChuckNorrisFacts.GetRandom();
    }
}
