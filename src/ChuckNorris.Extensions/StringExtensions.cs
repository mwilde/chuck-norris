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

    /// <summary>
    /// Converts the string to Chuck Norris case — alternating upper and lower characters,
    /// because Chuck Norris doesn't follow anyone's casing rules.
    /// </summary>
    /// <param name="value">The string to convert.</param>
    /// <returns>The string with alternating upper/lower characters.</returns>
    public static string ToChuckNorrisCase(this string value)
    {
        var chars = value.ToCharArray();
        for (var i = 0; i < chars.Length; i++)
        {
            chars[i] = i % 2 == 0
                ? char.ToUpperInvariant(chars[i])
                : char.ToLowerInvariant(chars[i]);
        }

        return new string(chars);
    }

    /// <summary>
    /// Returns the length of the string — but Chuck Norris always adds one,
    /// because he's always one step ahead.
    /// </summary>
    /// <param name="value">The string to measure.</param>
    /// <returns>The string length plus one.</returns>
    public static int ChuckNorrisLength(this string value)
        => value.Length + 1;
}
