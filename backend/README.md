# Backend

## Setup

From this folder:

```bash
uv sync
```

## Environment variables

Copy `.env.example` to `.env` and adjust values as needed.

## Task commands

- Run the local API server:

  ```bash
  uv run task run
  ```

- Auto-fix lint issues and format code:

  ```bash
  uv run task format
  ```

- Run lint checks, run tests and generate coverage:

  ```bash
  uv run task test
  ```

- Run fast unit tests only:

  ```bash
  uv run task test:unit
  ```

- Apply all pending database migrations:

  ```bash
  uv run task migrate:apply
  ```

- Generate a new migration after changing ORM models:
  ```bash
  uv run task migrate:make "describe your change"
  ```
