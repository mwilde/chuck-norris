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
}
