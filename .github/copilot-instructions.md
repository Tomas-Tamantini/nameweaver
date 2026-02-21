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

- Every code change should include focused validation:
  - add/update the smallest relevant test when tests exist,
  - run targeted tests first, then broader checks only if needed.
- If no automated tests exist, provide a short manual verification checklist.
- Do not claim success without reporting what was validated.

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
