namespace ChuckNorris.Extensions.Blazor;

using Microsoft.AspNetCore.Components;

/// <summary>
/// A Chuck Norris-themed dodge game. Click the target before the roundhouse kick ring closes in.
/// Chuck Norris doesn't miss. You do.
/// </summary>
public partial class ChuckNorrisDodge : ComponentBase, IDisposable
{
    private enum GameState
    {
        Idle,
        Playing,
        GameOver,
    }

    private const int ArenaSize = 360;
    private const int TargetSize = 48;
    private const double InitialKickDuration = 2000;
    private const double MinKickDuration = 500;
    private const double SpeedIncreasePerLevel = 150;

    private readonly System.Collections.Generic.Queue<DateTime> _recentKicks = new();
    private GameState _state = GameState.Idle;
    private int _highScore;
    private int _level;
    private double _targetX;
    private double _targetY;
    private double _kickRingSize;
    private double _kickRingOpacity;
    private double _kickDuration;
    private string _deathFact = string.Empty;
    private System.Threading.Timer? _kickTimer;
    private DateTime _kickStarted;

    /// <summary>Gets the current score.</summary>
    public int Score { get; private set; }

    /// <inheritdoc />
    protected override void OnInitialized() => PlaceTarget();

    private void StartGame()
    {
        Score = 0;
        _level = 1;
        _kickDuration = InitialKickDuration;
        _state = GameState.Playing;
        _deathFact = string.Empty;
        PlaceTarget();
        StartKickTimer();
    }

    private void PlaceTarget()
    {
        var margin = TargetSize + 10;
        _targetX = Random.Shared.Next(margin, ArenaSize - margin);
        _targetY = Random.Shared.Next(margin, ArenaSize - margin);
        _kickRingSize = ArenaSize * 2;
        _kickRingOpacity = 0.15;
        _kickStarted = DateTime.UtcNow;
    }

    private void StartKickTimer()
    {
        _kickTimer?.Dispose();
        _kickTimer = new System.Threading.Timer(
            _ => InvokeAsync(OnKickTick),
            null,
            0,
            30);
    }

    private async Task OnKickTick()
    {
        if (_state != GameState.Playing)
        {
            return;
        }

        var elapsed = (DateTime.UtcNow - _kickStarted).TotalMilliseconds;
        var progress = Math.Min(elapsed / _kickDuration, 1.0);

        _kickRingSize = Math.Max((1.0 - progress) * ArenaSize * 2, TargetSize);
        _kickRingOpacity = 0.15 + (progress * 0.7);

        if (progress >= 1.0)
        {
            await GameOver();
            return;
        }

        StateHasChanged();
    }

    private async Task HitTarget()
    {
        if (_state != GameState.Playing)
        {
            return;
        }

        Score++;

        _level = (Score / 5) + 1;
        _kickDuration = Math.Max(InitialKickDuration - (_level * SpeedIncreasePerLevel), MinKickDuration);

        PlaceTarget();
        StateHasChanged();
    }

    private async Task GameOver()
    {
        _state = GameState.GameOver;
        _kickTimer?.Dispose();

        if (Score > _highScore)
        {
            _highScore = Score;
        }

        _deathFact = await ChuckNorrisFacts.GetRandomAsync();
        StateHasChanged();
    }

    /// <inheritdoc />
    public void Dispose() => _kickTimer?.Dispose();
}
