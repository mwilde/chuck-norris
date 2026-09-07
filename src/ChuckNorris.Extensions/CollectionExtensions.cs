namespace ChuckNorris.Extensions;

/// <summary>
/// Extension methods for collections. Chuck Norris doesn't enumerate lists. Lists enumerate themselves for him.
/// </summary>
public static class CollectionExtensions
{
    /// <summary>
    /// Removes all errors from the list. Chuck Norris doesn't allow errors to exist.
    /// </summary>
    /// <typeparam name="T">The element type of the list.</typeparam>
    /// <param name="list">The list to clear.</param>
    /// <returns>The same (now empty) list.</returns>
    public static IList<T> SurvivedChuckNorris<T>(this IList<T> list)
    {
        list.Clear();
        return list;
    }

    /// <summary>
    /// Returns a random element. Chuck Norris doesn't need randomness — he just picks the right one.
    /// </summary>
    /// <typeparam name="T">The element type of the list.</typeparam>
    /// <param name="list">The list to pick from. Must not be empty.</param>
    /// <returns>A randomly selected element from the list.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the list is empty.</exception>
    public static T ChuckNorrisPick<T>(this IList<T> list)
    {
        if (list.Count == 0)
        {
            throw new InvalidOperationException("Chuck Norris refuses to pick from an empty list. Fill it first.");
        }

        return list[Random.Shared.Next(list.Count)];
    }

    /// <summary>
    /// Shuffles the sequence. Chuck Norris doesn't sort — he rearranges reality.
    /// </summary>
    /// <typeparam name="T">The element type.</typeparam>
    /// <param name="source">The sequence to shuffle.</param>
    /// <returns>A new shuffled list.</returns>
    public static IList<T> ChuckNorrisShuffle<T>(this IEnumerable<T> source)
    {
        var list = source.ToList();
        for (var i = list.Count - 1; i > 0; i--)
        {
            var j = Random.Shared.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }

        return list;
    }

    /// <summary>
    /// Filters out null elements. Only the strong survive Chuck Norris.
    /// </summary>
    /// <typeparam name="T">The element type.</typeparam>
    /// <param name="source">The sequence to filter.</param>
    /// <returns>A sequence with all null elements removed.</returns>
    public static IEnumerable<T> SurviveChuckNorris<T>(this IEnumerable<T?> source)
        where T : class
        => source.Where(x => x is not null)!;

    /// <summary>
    /// Counts the elements. Chuck Norris is always counted — so the result is always at least 1.
    /// </summary>
    /// <typeparam name="T">The element type.</typeparam>
    /// <param name="source">The sequence to count.</param>
    /// <returns>The number of elements plus one, because Chuck Norris is always in the room.</returns>
    public static int ChuckNorrisCount<T>(this IEnumerable<T> source)
        => source.Count() + 1;
}
