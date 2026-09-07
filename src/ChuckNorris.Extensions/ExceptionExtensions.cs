namespace ChuckNorris.Extensions;

/// <summary>
/// Chuck Norris-themed extension methods for <see cref="Exception"/>.
/// </summary>
public static class ExceptionExtensions
{
    /// <summary>
    /// Wraps the exception message with a Chuck Norris fact, because ordinary errors are too boring.
    /// </summary>
    /// <param name="exception">The exception to enhance.</param>
    /// <returns>A new <see cref="Exception"/> whose message starts with a Chuck Norris fact followed by the original message.</returns>
    public static Exception ChuckNorrisThrew(this Exception exception)
    {
        var fact = ChuckNorrisFacts.GetRandom();
        return new Exception($"{ChuckNorrisEmojis.Kick} Chuck Norris threw this: \"{fact}\" — Original error: {exception.Message}", exception);
    }

    /// <summary>
    /// Determines whether the exception was roundhouse kicked — i.e. caused by a <see cref="DivideByZeroException"/>.
    /// Only Chuck Norris can divide by zero; everyone else gets an exception.
    /// </summary>
    /// <param name="exception">The exception to inspect.</param>
    /// <returns><see langword="true"/> if the exception is a <see cref="DivideByZeroException"/>; otherwise <see langword="false"/>.</returns>
    public static bool WasRoundHouseKicked(this Exception exception)
        => exception is DivideByZeroException;

    /// <summary>
    /// Returns the message of the exception in all caps — because Chuck Norris doesn't whisper errors.
    /// </summary>
    /// <param name="exception">The exception to shout.</param>
    /// <returns>The exception message in uppercase.</returns>
    public static string Shout(this Exception exception)
        => exception.Message.ToUpperInvariant();
}
