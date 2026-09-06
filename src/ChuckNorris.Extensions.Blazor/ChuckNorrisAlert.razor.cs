namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;

/// <summary>
/// A retro-styled alert box component. Click it to summon a Chuck Norris modal.
/// Chuck Norris doesn't dismiss alerts. Alerts dismiss themselves.
/// </summary>
public partial class ChuckNorrisAlert : ComponentBase
{
    /// <summary>Gets or sets the alert severity type. Defaults to <see cref="ChuckNorrisAlertType.Info"/>.</summary>
    /// <value>The severity type controlling the alert's color and icon.</value>
    [Parameter]
    public ChuckNorrisAlertType Type { get; set; } = ChuckNorrisAlertType.Info;

    /// <summary>Gets or sets the alert title shown in the header.</summary>
    /// <value>The title text displayed at the top of the alert.</value>
    [Parameter]
    public string? Title { get; set; }

    /// <summary>Gets or sets the alert body content.</summary>
    /// <value>The Razor fragment rendered as the alert body.</value>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>Gets or sets a value indicating whether clicking the alert opens the Chuck Norris modal. Defaults to <c>true</c>.</summary>
    /// <value><c>true</c> to enable the click-to-modal behaviour; <c>false</c> to render as a plain alert.</value>
    [Parameter]
    public bool Clickable { get; set; } = true;

    /// <summary>Gets or sets a custom message shown in the modal. When <c>null</c>, the default type-based message is used.</summary>
    /// <value>A custom modal message string, or <c>null</c> to use the built-in Chuck Norris message.</value>
    [Parameter]
    public string? ModalMessage { get; set; }

    private bool ModalVisible { get; set; }

    private string Icon => Type switch
    {
        ChuckNorrisAlertType.Success => ChuckNorrisEmojis.Success,
        ChuckNorrisAlertType.Warning => ChuckNorrisEmojis.Warning,
        ChuckNorrisAlertType.Danger => ChuckNorrisEmojis.Kick,
        _ => ChuckNorrisEmojis.Info,
    };

    private string DefaultModalMessage => Type switch
    {
        ChuckNorrisAlertType.Success => "Chuck Norris once wrote a unit test. It passed. The first time. Every time.",
        ChuckNorrisAlertType.Warning => "Warning: Chuck Norris has been known to break production with a glance.",
        ChuckNorrisAlertType.Danger => "DANGER: Chuck Norris doesn't handle exceptions. Exceptions handle themselves.",
        _ => "Chuck Norris doesn't need Stack Overflow. Stack Overflow needs Chuck Norris.",
    };

    private string ResolvedModalMessage => ModalMessage ?? DefaultModalMessage;

    private void ShowModal()
    {
        if (Clickable)
        {
            ModalVisible = true;
        }
    }

    private void CloseModal() => ModalVisible = false;
}
