namespace ChuckNorris.Extensions;

/// <summary>
/// A fluent validator with Chuck Norris-themed error messages.
/// Chuck Norris doesn't validate input. Input validates itself out of fear.
/// </summary>
/// <typeparam name="T">The type of the value being validated.</typeparam>
public sealed class ChuckNorrisValidator<T>
{
    private readonly T _value;
    private readonly List<string> _errors = [];

    private ChuckNorrisValidator(T value) => _value = value;

    /// <summary>Starts a validation chain for the given value.</summary>
    /// <param name="value">The value to validate.</param>
    /// <returns>A new <see cref="ChuckNorrisValidator{T}"/> for the value.</returns>
    public static ChuckNorrisValidator<T> For(T value) => new(value);

    /// <summary>
    /// Adds a validation rule. If the predicate fails, a Chuck Norris fact is added as the error.
    /// </summary>
    /// <param name="predicate">The condition that must be <see langword="true"/> for the value to be valid.</param>
    /// <param name="reason">A short reason appended after the Chuck Norris fact.</param>
    /// <returns>The same validator for chaining.</returns>
    public ChuckNorrisValidator<T> Must(Func<T, bool> predicate, string reason)
    {
        if (!predicate(_value))
        {
            _errors.Add($"{ChuckNorrisEmojis.Kick} {ChuckNorrisFacts.GetRandom()} — {reason}");
        }

        return this;
    }

    /// <summary>Gets a value indicating whether all validation rules passed.</summary>
    public bool IsValid => _errors.Count == 0;

    /// <summary>Gets the list of Chuck Norris-flavoured error messages for all failed rules.</summary>
    public IReadOnlyList<string> Errors => _errors.AsReadOnly();

    /// <summary>
    /// Returns a <see cref="ChuckNorrisResult{T}"/> representing the validation outcome.
    /// Success when valid; failure with the first error message when invalid.
    /// </summary>
    /// <returns>A <see cref="ChuckNorrisResult{T}"/> wrapping the validated value or the first error.</returns>
    public ChuckNorrisResult<T> ToResult() => IsValid
        ? ChuckNorrisResult<T>.Success(_value)
        : ChuckNorrisResult<T>.Failure(_errors[0]);
}
