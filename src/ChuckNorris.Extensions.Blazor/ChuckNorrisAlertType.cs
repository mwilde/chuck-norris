namespace ChuckNorris.Extensions.Blazor;

/// <summary>
/// The severity/style type for a <see cref="ChuckNorrisAlert"/> component.
/// </summary>
public enum ChuckNorrisAlertType
{
    /// <summary>Informational — calm blue, Chuck Norris style.</summary>
    Info,

    /// <summary>Success — operation survived Chuck Norris's review.</summary>
    Success,

    /// <summary>Warning — proceed with caution. Chuck Norris is watching.</summary>
    Warning,

    /// <summary>Danger — roundhouse kick imminent.</summary>
    Danger,
}
