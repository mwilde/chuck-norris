# Changelog

All notable changes to `ChuckNorris.Extensions` will be documented here.

Chuck Norris doesn't need a changelog. His code is always correct from the beginning.

---

## [10.0.x] - 2026-09-07

### Added
- `StringExtensions`: `RoundHouseKick()`, `SurvivesChuckNorris()`, `ChuckNorrisApproved()`
- `IntExtensions`: `IsChuckNorrisApproved()`, `DivideByZero()`
- `BoolExtensions`: `ChuckNorrisDecides()`, `IsChuckNorrisApproved()`, `RoundHouseKick()`
- `DateTimeExtensions`: `IsChuckNorrisDay()`, `SurvivedChuckNorris()`, `RoundHouseKicksSince()`
- `CollectionExtensions`: `SurvivedChuckNorris()`, `ChuckNorrisPick()`
- `ChuckNorrisFacts`: 25 handcrafted Chuck Norris facts + live API fallback via `https://api.chucknorris.io`
- `ChuckNorrisMiddleware`: `app.UseChuckNorris()` — injects `X-Chuck-Norris-Fact` header into every HTTP response
- **Blazor package** (`ChuckNorris.Extensions.Blazor`):
  - `<ChuckNorrisFact>` — displays a random fact with optional live API fetch
  - `<ChuckNorrisAlert>` — styled alert box (Info / Success / Warning / Danger)
  - `<ChuckNorrisButton>` — button that shows a fact on click
  - `<ChuckNorris404>` — custom 404 not-found page component
  - `<ChuckNorrisSpinner>` — loading spinner with Chuck Norris quote
  - `<ChuckNorrisKonami>` — Konami code easter egg (↑↑↓↓←→←→)
  - `ChuckNorrisConsole` — renders facts to the browser console via JS interop
  - `<ChuckNorrisReconnectModal>` — retro Chuck Norris reconnect dialog (drop-in for Blazor's default `<ReconnectModal />`)
- Reqnroll BDD tests (xunit.v3 4.0.0) with 24 scenarios covering all extensions and middleware, using FluentAssertions v8
- Nerdbank.GitVersioning — patch version auto-incremented from git commit height
- GitHub Actions CI with random Chuck Norris fact on every push
- Auto-publish to NuGet.org on version tag

### Fixed
- Nothing. Chuck Norris doesn't ship bugs.
