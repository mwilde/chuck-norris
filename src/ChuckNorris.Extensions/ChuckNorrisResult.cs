namespace ChuckNorris.Extensions;

/// <summary>
/// A result type where success carries a value and failure carries a Chuck Norris fact as the error message.
/// Because if your code fails, at least you get a good story.
/// </summary>
/// <typeparam name="T">The type of the success value.</typeparam>
public sealed record ChuckNorrisResult<T>
{
    private readonly T? _value;

    private ChuckNorrisResult(T value)
    {
        _value = value;
        IsSuccess = true;
        Error = string.Empty;
    }

    private ChuckNorrisResult(string error)
    {
        _value = default;
        IsSuccess = false;
        Error = error;
    }

    /// <summary>Gets a value indicating whether the result is a success.</summary>
    public bool IsSuccess { get; init; }

    /// <summary>Gets a value indicating whether the result is a failure.</summary>
    public bool IsFailure => !IsSuccess;

    /// <summary>
    /// Gets the error message — always a Chuck Norris fact — when the result is a failure.
    /// Empty string on success.
    /// </summary>
    public string Error { get; init; }

    /// <summary>
    /// Gets the success value.
    /// </summary>
    /// <exception cref="InvalidOperationException">Thrown when accessing Value on a failed result.</exception>
    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException($"{ChuckNorrisEmojis.Kick} Chuck Norris says you can't access Value on a failed result.");

    /// <summary>Creates a successful result with the given value.</summary>
    /// <param name="value">The success value.</param>
    /// <returns>A successful <see cref="ChuckNorrisResult{T}"/>.</returns>
    public static ChuckNorrisResult<T> Success(T value) => new(value);

    /// <summary>
    /// Creates a failed result. The error message is automatically set to a random Chuck Norris fact.
    /// </summary>
    /// <returns>A failed <see cref="ChuckNorrisResult{T}"/>.</returns>
    public static ChuckNorrisResult<T> Failure() => new(ChuckNorrisFacts.GetRandom());

    /// <summary>
    /// Creates a failed result with a custom error message prefixed by a Chuck Norris fact.
    /// </summary>
    /// <param name="reason">The reason for failure.</param>
    /// <returns>A failed <see cref="ChuckNorrisResult{T}"/>.</returns>
    public static ChuckNorrisResult<T> Failure(string reason)
        => new($"{ChuckNorrisFacts.GetRandom()} — {reason}");
}
