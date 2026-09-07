# chuck-norris 🥋

> *"Chuck Norris doesn't write extensions. He stares at the code until it extends itself."*

A collection of Chuck Norris-themed .NET extensions, middleware, and general nonsense.
Because every codebase deserves a roundhouse kick.

[![NuGet](https://img.shields.io/nuget/v/ChuckNorris.Extensions?label=ChuckNorris.Extensions&color=blue)](https://www.nuget.org/packages/ChuckNorris.Extensions)
[![NuGet](https://img.shields.io/nuget/v/ChuckNorris.Extensions.Blazor?label=ChuckNorris.Extensions.Blazor&color=blue)](https://www.nuget.org/packages/ChuckNorris.Extensions.Blazor)
[![NuGet](https://img.shields.io/nuget/v/ChuckNorris.Extensions.FluentAssertions?label=ChuckNorris.Extensions.FluentAssertions&color=blue)](https://www.nuget.org/packages/ChuckNorris.Extensions.FluentAssertions)

---

## Installation

```bash
dotnet add package ChuckNorris.Extensions
```

For Blazor components:

```bash
dotnet add package ChuckNorris.Extensions.Blazor
```

For FluentAssertions extensions (test projects):

```bash
dotnet add package ChuckNorris.Extensions.FluentAssertions
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

### ChuckNorrisResult&lt;T&gt;

A result type where failures come with a Chuck Norris fact as the error message:

```csharp
var ok = ChuckNorrisResult<string>.Success("it works");
ok.IsSuccess;  // true
ok.Value;      // "it works"

var fail = ChuckNorrisResult<string>.Failure();
fail.IsFailure;  // true
fail.Error;      // "Chuck Norris can divide by zero." (random fact)

var fail2 = ChuckNorrisResult<string>.Failure("database is on fire");
fail2.Error;  // "...fact... — database is on fire"
```

### ChuckNorrisValidator&lt;T&gt;

Fluent validation where every broken rule gives you a Chuck Norris fact:

```csharp
var result = ChuckNorrisValidator<string>.For(userInput)
    .Must(s => !string.IsNullOrEmpty(s), "value must not be empty")
    .Must(s => s.Length >= 3, "value must be at least 3 characters")
    .ToResult();

result.IsSuccess;       // true / false
result.Error;           // "...Chuck fact... — value must not be empty"

// Or inspect errors directly
var validator = ChuckNorrisValidator<string>.For("")
    .Must(s => !string.IsNullOrEmpty(s), "must not be empty");

validator.IsValid;      // false
validator.Errors;       // ["🥋 ...fact... — must not be empty"]
```

## FluentAssertions Extensions

Add `using ChuckNorris.Extensions.FluentAssertions;` to get Chuck Norris-themed assertion methods.
When a test fails, you get a Chuck Norris fact in the failure message. 🥋

```csharp
// Strings
"hello".Should().SurviveChuckNorris();
"".Should().NotSurviveChuckNorris();

// Booleans
true.Should().BeChuckNorrisApproved();

// Integers
42.Should().BeChuckNorrisApproved();

// ChuckNorrisResult<T> — use ChuckShould() to avoid ambiguity with standard Should()
var result = ChuckNorrisResult<string>.Success("it works");
result.ChuckShould().BeSuccessful();

ChuckNorrisResult<string>.Failure().ChuckShould().BeAFailure();
```

Failure message example:
```
🥋 Chuck Norris can divide by zero. — Expected the boolean to be Chuck Norris approved (true), but it was false.
```

### Collection Extensions

```csharp
var errors = new List<string> { "NullRef", "Timeout" };
errors.RoundHouseKickAll();     // clears the list — Chuck Norris shows no mercy

var items = new List<string> { "roundhouse", "kick", "beard" };
items.ChuckNorrisPick();        // returns a random element

items.ChuckNorrisShuffle();     // returns the list in a new random order

items.ChuckNorrisFirst();       // returns the first element, or throws with a Chuck Norris fact

// Only the strong survive Chuck Norris (filters out nulls)
var withNulls = new List<string?> { "chuck", null, "norris", null };
withNulls.SurviveChuckNorris(); // ["chuck", "norris"]

// Chuck Norris doesn't allow duplicates
var dupes = new List<string> { "chuck", "norris", "chuck" };
dupes.ChuckNorrisDistinct();    // ["chuck", "norris"]

// Chuck Norris is always counted
items.ChuckNorrisCount();       // 4 (3 items + Chuck Norris himself)
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

<!-- Clicker mini-game — click to roundhouse kick, get facts every 10 kicks -->
<ChuckNorrisClicker />
<ChuckNorrisClicker FactInterval="5" />
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
