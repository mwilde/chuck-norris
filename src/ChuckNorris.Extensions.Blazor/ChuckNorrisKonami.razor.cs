namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

/// <summary>
/// Listens for the Konami code (↑↑↓↓←→←→) and reveals a Chuck Norris fact when triggered.
/// Chuck Norris invented the Konami code. He just lets you use it.
/// </summary>
public partial class ChuckNorrisKonami : ComponentBase, IAsyncDisposable
{
    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    private bool Activated { get; set; }

    private string Fact { get; set; } = string.Empty;

    private IJSObjectReference? _module;

    private DotNetObjectReference<ChuckNorrisKonami>? _ref;

    /// <inheritdoc />
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        _module = await JS.InvokeAsync<IJSObjectReference>("import", "./_content/ChuckNorris.Extensions.Blazor/chuck-norris.js");
        _ref = DotNetObjectReference.Create(this);
        await _module.InvokeVoidAsync("initKonamiCode", _ref);
    }

    /// <summary>Called from JavaScript when the Konami sequence is detected.</summary>
    /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
    [JSInvokable]
    public async Task OnKonamiCode()
    {
        Fact = await ChuckNorrisFacts.GetRandomAsync();
        Activated = true;
        StateHasChanged();
    }

    private void Dismiss() => Activated = false;

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.InvokeVoidAsync("disposeKonamiCode");
            await _module.DisposeAsync();
        }

        _ref?.Dispose();
    }
}
