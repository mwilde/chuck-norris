# chuck-norris 🥋

> *"Chuck Norris doesn't write extensions. He stares at the code until it extends itself."*

A collection of Chuck Norris-themed .NET extensions, middleware, and general nonsense.
Because every codebase deserves a roundhouse kick.

---

## Installation

```bash
dotnet add package ChuckNorris.Extensions
```

For Blazor components:

```bash
dotnet add package ChuckNorris.Extensions.Blazor
```

---

## Usage

### String Extensions

```csharp
using ChuckNorris.Extensions;

"hello".RoundHouseKick();           // "HELLO 🥋"
"my code".ChuckNorrisApproved();    // "my code — Chuck Norris approved. 💪"
"valid".SurvivesChuckNorris();      // true
"".SurvivesChuckNorris();           // false (empty strings don't survive)
"hello".ToChuckNorrisCase();        // "HeLlO" (Chuck Norris doesn't follow casing rules)
"hello".ChuckNorrisLength();        // 6 (always one ahead)
```

### Integer Extensions

```csharp
42.IsChuckNorrisApproved();   // true (always — Chuck Norris approves all numbers)
42.DivideByZero();            // double.PositiveInfinity (Chuck Norris can do it)
```

### Bool Extensions

```csharp
false.ChuckNorrisDecides();       // true (Chuck Norris overrules)
false.IsChuckNorrisApproved();    // false (returns value as-is — no cheating here)
true.RoundHouseKick();            // false (kicks it to the other side)
```

### DateTime Extensions

```csharp
DateTime.Today.IsChuckNorrisDay();           // true if today is Saturday
new DateTime(2000, 1, 1).SurvivedChuckNorris();   // true (it's in the past)
new DateTime(2000, 1, 1).RoundHouseKicksSince();  // seconds elapsed since that date
```

### Exception Extensions

```csharp
var ex = new Exception("database exploded");
ex.ChuckNorrisThrew();     // new Exception("🥋 Chuck Norris threw this: \"...fact...\" — Original error: database exploded")
ex.WasRoundHouseKicked();  // false (not a DivideByZeroException)
ex.Shout();                // "DATABASE EXPLODED"

new DivideByZeroException().WasRoundHouseKicked();  // true
```

### Collection Extensions

```csharp
var errors = new List<string> { "NullRef", "Timeout" };
errors.SurvivedChuckNorris();   // clears the list — Chuck Norris doesn't allow errors

var items = new List<string> { "roundhouse", "kick", "beard" };
items.ChuckNorrisPick();        // returns a random element, Chuck Norris style
```

### Random Chuck Norris Fact

```csharp
// From built-in list (offline-safe)
var fact = ChuckNorrisFacts.GetRandom();

// From https://api.chucknorris.io — falls back to built-in list if offline
var fact = await ChuckNorrisFacts.GetRandomAsync();

Console.WriteLine(fact);
// "Chuck Norris can divide by zero."
```

### ASP.NET Core Middleware

Adds a `X-Chuck-Norris-Fact` header to every HTTP response:

```csharp
// Program.cs
app.UseChuckNorris();
```

Every response your API sends will contain a Chuck Norris fact header. Your users will thank you.
Or they won't. Chuck Norris doesn't care either way.

---

## Blazor Components

Add to `_Imports.razor`:

```razor
@using ChuckNorris.Extensions.Blazor
```

And register in `Program.cs`:

```csharp
builder.Services.AddHttpClient();
```

### Components

```razor
<!-- Random fact display (fetches from API if online) -->
<ChuckNorrisFact />

<!-- Styled alert box (click to see a Chuck Norris alert) -->
<ChuckNorrisAlert Title="Stay dangerous." Type="ChuckNorrisAlertType.Warning">
    Chuck Norris doesn't need async/await. Everything runs synchronously out of respect.
</ChuckNorrisAlert>

<!-- Non-clickable alert — no modal -->
<ChuckNorrisAlert Title="FYI" Clickable="false" Type="ChuckNorrisAlertType.Info">
    Chuck Norris is watching.
</ChuckNorrisAlert>

<!-- Button that roundhouse kicks on click -->
<ChuckNorrisButton>Roundhouse Kick</ChuckNorrisButton>

<!-- Custom 404 page -->
<ChuckNorris404 />

<!-- Loading spinner with Chuck Norris quote -->
<ChuckNorrisSpinner />
<ChuckNorrisSpinner Message="Loading facts... please be patient." />

<!-- Konami code easter egg (↑↑↓↓←→←→) -->
<ChuckNorrisKonami />
```

`ChuckNorrisConsole` logs a fact to the browser console on page load — no markup needed, just add it anywhere:

```razor
<ChuckNorrisConsole />
```

`ChuckNorrisReconnectModal` replaces the default Blazor reconnect dialog with a Chuck Norris-themed retro modal. Drop it in `App.razor` instead of the default `<ReconnectModal />`:

```razor
<ChuckNorrisReconnectModal />
```

---

## GitHub Actions

Every push to this repo triggers a build — and prints a Chuck Norris fact in the CI logs.
Check the **Actions** tab. You're welcome.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Chuck Norris is watching.
