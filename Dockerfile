FROM node:22-slim AS frontend-build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Build the frontend
COPY "package.json" "pnpm-lock.yaml" ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM python:3.12-slim AS backend-build

RUN pip install poetry==1.8.3

WORKDIR /app

ENV POETRY_NO_INTERACTION=1 \
POETRY_VIRTUALENVS_IN_PROJECT=1 \
POETRY_VIRTUALENVS_CREATE=1 \
POETRY_CACHE_DIR=/tmp/poetry_cache

COPY ./backend/pyproject.toml ./backend/poetry.lock ./
RUN touch README.md
RUN poetry install --without dev --no-root && rm -rf ${POETRY_CACHE_DIR}

COPY ./backend /app

FROM python:3.12-slim AS runner

COPY --from=backend-build /app /app
COPY --from=frontend-build /app/dist /dist

ENV PYTHONUNBUFFERED="true"

WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["gunicorn", "-w", "2", "-t", "4", "-b", "0.0.0.0:8000", "app:app"]