namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

/// <summary>
/// A Chuck Norris-themed side-scrolling canvas runner game.
/// Jump over ninjas with ↑ / Space, or kick them with ↓ / Ctrl.
/// Kicking a ninja gives +50 score bonus. Speed increases over time.
/// Chuck Norris doesn't run. He advances toward the enemy.
/// </summary>
public partial class ChuckNorrisRunner : ComponentBase, IAsyncDisposable
{
    private enum RunnerState
    {
        Idle,
        Playing,
        Dead,
    }

    private static readonly string[] Subtitles =
    [
        "Chuck Norris doesn't jump. He pulls the ground down.",
        "These ninjas had a good run. It ended here.",
        "Chuck Norris once ran so fast he lapped himself.",
        "Warning: Ninjas ahead. Chuck Norris is not worried.",
        "Chuck Norris doesn't avoid obstacles. Obstacles avoid him.",
    ];

    private readonly string _canvasId = $"chuck-runner-{Guid.NewGuid():N}";
    private IJSObjectReference? _module;
    private DotNetObjectReference<ChuckNorrisRunner>? _dotnetRef;
    private RunnerState _state = RunnerState.Idle;
    private int _score;
    private int _kills;
    private int _highScore;
    private int _highKills;
    private string _deathFact = string.Empty;
    private string _subtitle = string.Empty;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = default!;

    /// <summary>Gets or sets a value indicating whether to use the live Chuck Norris API for facts. Defaults to <c>true</c>.</summary>
    [Parameter]
    public bool UseLiveApi { get; set; } = true;

    /// <inheritdoc />
    protected override void OnInitialized()
        => _subtitle = Subtitles[Random.Shared.Next(Subtitles.Length)];

    /// <inheritdoc />
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        _module = await JSRuntime.InvokeAsync<IJSObjectReference>(
            "import",
            "./_content/ChuckNorris.Extensions.Blazor/chuck-norris-runner.js");

        _dotnetRef = DotNetObjectReference.Create(this);
        await _module.InvokeVoidAsync("init", _canvasId, _dotnetRef);
    }

    private async Task StartGame()
    {
        if (_module is null)
        {
            return;
        }

        _state = RunnerState.Playing;
        _kills = 0;
        _deathFact = string.Empty;
        StateHasChanged();

        await _module.InvokeVoidAsync("startGame", _canvasId);
    }

    /// <summary>Called from JS when the player dies.</summary>
    [JSInvokable]
    public async Task OnGameOver(int score, int kills)
    {
        _score = score;
        _kills = kills;
        if (_score > _highScore)
        {
            _highScore = _score;
        }

        if (_kills > _highKills)
        {
            _highKills = _kills;
        }

        _state = RunnerState.Dead;
        _deathFact = UseLiveApi
            ? await ChuckNorrisFacts.GetRandomAsync()
            : ChuckNorrisFacts.GetRandom();

        await InvokeAsync(StateHasChanged);
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.InvokeVoidAsync("dispose", _canvasId);
            await _module.DisposeAsync();
        }

        _dotnetRef?.Dispose();
    }
}
