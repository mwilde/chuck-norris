# Changelog

All notable changes to `ChuckNorris.Extensions` will be documented here.

Chuck Norris doesn't need a changelog. His code is always correct from the beginning.

---

## [10.1.x] - Unreleased

### Added
- `ChuckNorrisClicker` Blazor component — clicker mini-game with kicks/sec counter and facts every N kicks
- `ChuckNorrisDodge` Blazor component — dodge mini-game, click the target before the roundhouse kick ring closes in
- `ChuckNorrisRunner` Blazor component — canvas side-scroller: jump over ninjas (↑/Space) or roundhouse kick them (↓/Ctrl) for +50 score bonus; kill counter, speed scaling, death screen with Chuck fact

---

## [10.0.x] - 2026-09-07

### Added
- Chuck Norris-themed extension methods for strings, integers, booleans, datetimes, exceptions, and collections
- `IEnumerable` extensions: `RoundHouseKickAll`, shuffle, null filtering, first-or-throw, distinct, and Chuck Norris-aware count
- Chuck Norris facts — 25 handcrafted + live API fallback via `https://api.chucknorris.io`
- ASP.NET Core middleware that injects a Chuck Norris fact header into every HTTP response
- Blazor component library (`ChuckNorris.Extensions.Blazor`) with fact display, alerts, buttons, 404 page, spinner, Konami code easter egg, console logger, and reconnect modal
- Reqnroll BDD test suite covering all extensions and middleware
- Nerdbank.GitVersioning for automatic patch versioning
- GitHub Actions CI with a Chuck Norris fact on every push
- Auto-publish to NuGet.org on version tag

### Fixed
- Nothing. Chuck Norris doesn't ship bugs.
