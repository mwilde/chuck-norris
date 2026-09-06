namespace ChuckNorris.Extensions;

/// <summary>
/// Extension methods for integers. Numbers don't have value — Chuck Norris assigns it to them.
/// </summary>
public static class IntExtensions
{
    /// <summary>
    /// Chuck Norris approves all numbers. Even yours.
    /// </summary>
    /// <param name="value">The integer to approve.</param>
    /// <returns>Always <c>true</c>.</returns>
    public static bool IsChuckNorrisApproved(this int value) => true;

    /// <summary>
    /// Divides by zero. Chuck Norris can do it. You're welcome.
    /// </summary>
    /// <param name="value">The integer to divide.</param>
    /// <returns>Always <see cref="double.PositiveInfinity"/>.</returns>
    public static double DivideByZero(this int value)
    {
        // Chuck Norris doesn't throw DivideByZeroException.
        // He returns double.PositiveInfinity and moves on with his life.
        return value == 0 ? double.PositiveInfinity : double.PositiveInfinity;
    }
}
