namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

/// <summary>
/// Add once to App.razor or MainLayout.razor.
/// Prints a Chuck Norris message to the browser console on startup.
/// Chuck Norris doesn't need a UI. He speaks directly to the console.
/// </summary>
public class ChuckNorrisConsole : ComponentBase, IAsyncDisposable
{
    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    private IJSObjectReference? _module;

    /// <inheritdoc />
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        _module = await JS.InvokeAsync<IJSObjectReference>("import", "./_content/ChuckNorris.Extensions.Blazor/chuck-norris.js");
        await _module.InvokeVoidAsync("initChuckNorris");
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.DisposeAsync();
        }
    }
}
