namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;

/// <summary>
/// A Chuck Norris-themed clicker game. Click to roundhouse kick. Get a fact every <see cref="FactInterval"/> kicks.
/// Chuck Norris doesn't play games. Games play themselves in his honor.
/// </summary>
public partial class ChuckNorrisClicker : ComponentBase, IDisposable
{
    private static readonly string[] Subtitles =
    [
        "Chuck Norris doesn't click buttons. Buttons click themselves.",
        "Every kick counts. Chuck Norris has counted to infinity. Twice.",
        "Warning: May cause roundhouse kicking in real life.",
        "Chuck Norris once clicked so fast he broke the internet.",
        "Each kick is a roundhouse. There are no other kinds.",
    ];

    private readonly System.Collections.Generic.Queue<DateTime> _recentKicks = new();
    private bool _kicking;
    private bool _factVisible;
    private string _currentFact = string.Empty;
    private string _lastMilestone = string.Empty;
    private string _subtitle = string.Empty;
    private double _kps;
    private int _nextMilestone;
    private System.Threading.Timer? _kpsTimer;

    /// <summary>Gets the total number of kicks.</summary>
    public int Kicks { get; private set; }

    /// <summary>Gets or sets how many kicks between each Chuck Norris fact. Defaults to 10.</summary>
    [Parameter]
    public int FactInterval { get; set; } = 10;

    /// <summary>Gets or sets a value indicating whether to use the live Chuck Norris API for facts. Defaults to <c>true</c>.</summary>
    [Parameter]
    public bool UseLiveApi { get; set; } = true;

    /// <summary>Gets or sets a callback invoked on every kick, passing the current kick count.</summary>
    [Parameter]
    public EventCallback<int> OnKick { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        _subtitle = Subtitles[Random.Shared.Next(Subtitles.Length)];
        _nextMilestone = FactInterval;
        _kpsTimer = new System.Threading.Timer(
            _ =>
            {
                var cutoff = DateTime.UtcNow.AddSeconds(-1);
                while (_recentKicks.Count > 0 && _recentKicks.Peek() < cutoff)
                {
                    _recentKicks.Dequeue();
                }

                _kps = _recentKicks.Count;
                InvokeAsync(StateHasChanged);
            },
            null,
            0,
            200);
    }

    private async Task Kick()
    {
        Kicks++;
        _recentKicks.Enqueue(DateTime.UtcNow);

        _kicking = true;
        StateHasChanged();

        await Task.Delay(120);
        _kicking = false;

        if (Kicks % FactInterval == 0)
        {
            _lastMilestone = Kicks.ToString();
            _currentFact = UseLiveApi
                ? await ChuckNorrisFacts.GetRandomAsync()
                : ChuckNorrisFacts.GetRandom();
            _factVisible = true;
            _nextMilestone = Kicks + FactInterval;
        }

        if (OnKick.HasDelegate)
        {
            await OnKick.InvokeAsync(Kicks);
        }

        StateHasChanged();
    }

    /// <inheritdoc />
    public void Dispose() => _kpsTimer?.Dispose();
}
