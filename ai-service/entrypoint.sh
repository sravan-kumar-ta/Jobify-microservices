#!/bin/sh
set -e

echo "Starting ai-service entrypoint..."

# Default values (safe fallbacks)
: "${DB_HOST:=ai-db}"
: "${DB_PORT:=5432}"

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
# Wait until PostgreSQL is reachable
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "PostgreSQL is unavailable - sleeping..."
  sleep 2
done

echo "PostgreSQL is up."

python manage.py shell -c "
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute('CREATE EXTENSION IF NOT EXISTS vector;')
print('pgvector extension ensured.')
"

echo "Running Django migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Django ASGI server with Daphne..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application