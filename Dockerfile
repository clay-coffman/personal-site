# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install UV for fast package management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files first for better caching
COPY pyproject.toml ./

# Create virtual environment and install dependencies
# Use uv pip install instead of sync since we don't have a lock file
RUN uv venv && \
    . .venv/bin/activate && \
    uv pip install -e . --no-deps && \
    uv pip install Flask Flask-SQLAlchemy Flask-Login python-dotenv gunicorn

# Copy application code
COPY . .

# Create a non-root user to run the app
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Set environment variables
ENV FLASK_APP=app.py \
    FLASK_ENV=production \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 5000

# Use gunicorn for production
CMD [".venv/bin/gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:create_app()"]