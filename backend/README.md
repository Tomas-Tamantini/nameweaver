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
