# Copilot instructions for this repository

## Project intent

- Nameweaver helps users remember people by storing names plus useful context.
- Core value: quickly capture and review short descriptions, facts, and dated events tied to each person.
- MVP scope is a straightforward CRUD app: create/read/update/delete people, notes, and facts/events.
- Relationship tracking between people (for example parent/child) is desirable, but should stay simple in the MVP.
- Prefer practical, incremental decisions that keep implementation understandable and easy to ship.
- This repository is also a CI/CD learning project: favor changes that improve testability, automation, and deployment confidence.
- Non-goals for now: AI features, analytics, or social/network modeling.

## Working style (default)

- Prioritize theoretical discussion and design reasoning before writing code.
- For implementation requests, start by proposing 2-3 options with tradeoffs, then recommend one.
- If requirements are ambiguous, ask concise clarifying questions before coding.

## Change policy

- Keep changes minimal and isolated to one logical concern at a time.
- Avoid broad refactors unless explicitly requested.
- Prefer incremental PR-sized diffs over large rewrites.
- Do not introduce new dependencies unless clearly justified and approved.

## Testing policy

- Automated tests are highly important. The vast majority of code changes must include or update tests.
- Do not claim success without reporting what was validated.
- Run targeted tests first, then broader checks only if needed.

### Test pyramid

- **Follow the test pyramid strictly**: prefer many fast unit tests at the base, few slow integration tests at the top.
- **Unit tests** are the default. Cover logic, validation, edge cases, and error handling thoroughly with unit tests. They should be fast and isolated (use fakes/stubs/mocks for external dependencies).
- **Integration tests** are expensive. Use them only to verify that real components wire together correctly:
  - Test the happy path.
  - Test at most one or two critical error/edge cases that cannot be covered by unit tests alone (e.g., database constraint violations, HTTP-level error responses).
  - Do not duplicate error-case coverage that unit tests already provide.
- When adding a new feature, write unit tests first. Add integration tests only for the wiring that unit tests cannot reach.

## Autonomy guardrails

- Do not implement code when the user is clearly asking for discussion-only exploration.
- Prefer asking for confirmation before:
  - multi-file edits,
  - schema/data-model changes,
  - destructive operations.

## Decision quality

- Favor maintainability and readability over cleverness.
- Match existing project style and conventions.
- Fix root causes where practical, but stay within requested scope.
