#!/bin/bash
set -e

echo "Running Database Migrations..."
alembic upgrade head

echo "Seeding Admin User..."
python -m src.create_admin

# --- ADD THIS LINE ---
echo "Seeding Real World Test Data..."
python -m src.seed_data
# ---------------------

echo "Starting Uvicorn Server..."
exec uvicorn src.main:app --host 0.0.0.0 --port 8000