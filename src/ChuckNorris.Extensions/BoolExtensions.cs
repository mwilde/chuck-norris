namespace ChuckNorris.Extensions;

/// <summary>
/// Extension methods for booleans. Chuck Norris doesn't evaluate conditions. Conditions evaluate themselves for him.
/// </summary>
public static class BoolExtensions
{
    /// <summary>
    /// Lets Chuck Norris decide. He always decides <c>true</c>.
    /// Because Chuck Norris doesn't do <c>false</c>.
    /// </summary>
    /// <param name="value">The boolean value. Chuck Norris ignores it.</param>
    /// <returns>Always <c>true</c>. Chuck Norris has spoken.</returns>
    public static bool ChuckNorrisDecides(this bool value)
        => true;

    /// <summary>
    /// Determines whether this boolean value is Chuck Norris approved.
    /// Only <c>true</c> is approved. Chuck Norris doesn't approve of weakness.
    /// </summary>
    /// <param name="value">The boolean value to evaluate.</param>
    /// <returns><c>true</c> if the value is <c>true</c>; otherwise <c>false</c>.</returns>
    public static bool IsChuckNorrisApproved(this bool value)
        => value;

    /// <summary>
    /// Performs a roundhouse kick on the boolean, flipping it.
    /// Chuck Norris can change reality — and so can this method.
    /// </summary>
    /// <param name="value">The boolean value to kick.</param>
    /// <returns>The negated boolean value.</returns>
    public static bool RoundHouseKick(this bool value)
        => !value;
}
