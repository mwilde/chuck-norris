namespace ChuckNorris.Extensions;

/// <summary>
/// Chuck Norris-themed extension methods for <see cref="DateTime"/>.
/// </summary>
public static class DateTimeExtensions
{
    /// <summary>
    /// Determines whether the given date is a Chuck Norris day (a Saturday — because Chuck Norris roundhouse kicks
    /// every week into the weekend).
    /// </summary>
    /// <param name="dateTime">The date to check.</param>
    /// <returns><see langword="true"/> if the day is Saturday; otherwise <see langword="false"/>.</returns>
    public static bool IsChuckNorrisDay(this DateTime dateTime)
        => dateTime.DayOfWeek == DayOfWeek.Saturday;

    /// <summary>
    /// Determines whether the given date is in the past — because if it is, Chuck Norris already survived it.
    /// </summary>
    /// <param name="dateTime">The date to check.</param>
    /// <returns><see langword="true"/> if the date is before <see cref="DateTime.UtcNow"/>; otherwise <see langword="false"/>.</returns>
    public static bool SurvivedChuckNorris(this DateTime dateTime)
        => dateTime < DateTime.UtcNow;

    /// <summary>
    /// Returns how many roundhouse kicks Chuck Norris could deliver in the time span since the given date
    /// (one kick per second, because Chuck Norris is that fast).
    /// </summary>
    /// <param name="dateTime">The start date.</param>
    /// <returns>The number of whole seconds elapsed since <paramref name="dateTime"/>.</returns>
    public static long RoundHouseKicksSince(this DateTime dateTime)
        => (long)Math.Max(0, (DateTime.UtcNow - dateTime).TotalSeconds);
}
