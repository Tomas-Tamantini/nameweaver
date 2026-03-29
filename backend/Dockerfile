FROM python:3.14-slim

# Install curl for healthchecks and libpq for psycopg2
RUN apt-get update && apt-get install -y curl libpq5 && rm -rf /var/lib/apt/lists/*

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . /app

# Install the application dependencies.
WORKDIR /app
RUN uv sync --frozen --no-cache

# Run migrations then start the application.
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/app/.venv/bin/fastapi", "run", "src/backend/app.py", "--port", "8000", "--host", "0.0.0.0"]