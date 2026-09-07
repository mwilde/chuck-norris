# Contributing to ChuckNorris.Extensions

> *"Chuck Norris doesn't open pull requests. He force pushes to `main` and the pipeline passes out of fear."*

But you are not Chuck Norris. So please follow these rules. 🥋

---

## Rules of Engagement

1. **Chuck Norris doesn't write bugs.** Please make sure your code is bug-free before submitting.
   If you find a bug, it was probably put there by someone who angered Chuck Norris.

2. **Chuck Norris doesn't need tests.** You do. All new code must be covered by BDD scenarios using Reqnroll.
   The test suite always passes. It wouldn't dare fail.

3. **Chuck Norris doesn't need code reviews.** You do. Open a pull request and wait for approval.
   PRs merged without review will be roundhouse kicked out of the repo.

4. **Chuck Norris doesn't write comments.** You should.
   All public members require XML documentation. Chuck Norris's code is self-explanatory out of intimidation.

5. **Chuck Norris doesn't handle errors.** You must.
   All edge cases must be handled. Throwing unhandled exceptions is disrespectful to Chuck Norris.

6. **Chuck Norris doesn't follow naming conventions.** You must.
   StyleCop is enforced — `dotnet build` must produce zero warnings.

7. **Chuck Norris never breaks backwards compatibility.** Neither should you.
   Introducing breaking changes without a major version bump will result in a virtual roundhouse kick.

8. **Chuck Norris always updates the docs.** So should you.
   Every PR must update the README and CHANGELOG. The PR template will remind you.

---

## How to Contribute

```bash
git clone https://github.com/mwilde/chuck-norris.git
cd chuck-norris
dotnet restore
dotnet build
dotnet run --project tests/ChuckNorris.Extensions.Tests
```

Then open a PR. Chuck Norris is watching. 👀

---

## Adding a New Extension

- Add your extension class to `src/ChuckNorris.Extensions/`
- Add a `.feature` file in `tests/ChuckNorris.Extensions.Tests/Features/`
- Add a context and step class in the matching `Contexts/` and `Steps/` folders
- If it fits the FluentAssertions package, add it to `src/ChuckNorris.Extensions.FluentAssertions/` too

---

## Code of Conduct

Be excellent to each other. Chuck Norris would want it that way.
(He also wouldn't want it any other way — trust us.)
