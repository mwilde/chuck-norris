namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

/// <summary>
/// A button that performs a roundhouse kick animation on click.
/// Chuck Norris doesn't click buttons. Buttons click themselves out of respect.
/// </summary>
public partial class ChuckNorrisButton : ComponentBase, IAsyncDisposable
{
    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    /// <summary>Gets or sets the button label content.</summary>
    /// <value>The Razor fragment rendered inside the button.</value>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>Gets or sets an optional callback invoked after the kick.</summary>
    /// <value>An <see cref="EventCallback"/> fired when the button is clicked.</value>
    [Parameter]
    public EventCallback OnClicked { get; set; }

    /// <summary>Gets or sets a value indicating whether the <see cref="ChuckNorrisEmojis.Kick"/> emoji is shown inside the button. Defaults to <c>true</c>.</summary>
    /// <value><c>true</c> to show the roundhouse kick emoji; <c>false</c> to render text-only.</value>
    [Parameter]
    public bool ShowEmoji { get; set; } = true;

    private ElementReference _buttonRef;

    private IJSObjectReference? _module;

    /// <inheritdoc />
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            _module = await JS.InvokeAsync<IJSObjectReference>(
                "import",
                "./_content/ChuckNorris.Extensions.Blazor/chuck-norris.js");
        }
    }

    private async Task OnClick()
    {
        if (_module is not null)
        {
            await _module.InvokeVoidAsync("triggerKick", _buttonRef);
        }

        await OnClicked.InvokeAsync();
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
