FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:0.9.7 /uv /uvx /bin/

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1

# Resolve dependencies from the lockfile before copying source, so edits to the
# service don't invalidate the (slow) dependency layer.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

COPY . .

# Run as the venv's interpreter without needing `uv run` at start-up.
ENV PATH="/app/.venv/bin:$PATH"

RUN useradd --uid 10001 --create-home patchforge && chown -R patchforge:patchforge /app
USER patchforge

EXPOSE 50051

CMD ["python", "server.py"]
