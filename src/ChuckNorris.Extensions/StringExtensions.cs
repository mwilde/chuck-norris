namespace ChuckNorris.Extensions;

/// <summary>
/// Extension methods for strings. Chuck Norris doesn't extend strings. Strings extend Chuck Norris.
/// </summary>
public static class StringExtensions
{
    /// <summary>
    /// Performs a roundhouse kick on the string.
    /// The string will be returned in uppercase because Chuck Norris doesn't do lowercase.
    /// </summary>
    /// <param name="value">The string to kick.</param>
    /// <returns>The uppercased string with a 🥋 appended.</returns>
    public static string RoundHouseKick(this string value)
        => value.ToUpperInvariant() + $" {ChuckNorrisEmojis.Kick}";

    /// <summary>
    /// Determines whether this string would survive Chuck Norris.
    /// Spoiler: only non-empty strings have a chance.
    /// </summary>
    /// <param name="value">The string to test.</param>
    /// <returns><c>true</c> if the string is non-null, non-empty and non-whitespace; otherwise <c>false</c>.</returns>
    public static bool SurvivesChuckNorris(this string? value)
        => !string.IsNullOrWhiteSpace(value);

    /// <summary>
    /// Makes the string Chuck Norris approved by appending his signature move.
    /// </summary>
    /// <param name="value">The string to approve.</param>
    /// <returns>The original string with the Chuck Norris approval stamp appended.</returns>
    public static string ChuckNorrisApproved(this string value)
        => $"{value} — Chuck Norris approved. {ChuckNorrisEmojis.Approved}";
}
