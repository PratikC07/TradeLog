import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy import create_engine

from alembic import context

# ---------------------------------------------------------
# 1. IMPORT YOUR SETTINGS & MODELS
# ---------------------------------------------------------
import sys
import os
# Add the parent directory to path so we can import 'src'
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.config import settings  # To get DATABASE_URL
from src.database.core import Base # To get Metadata

# Import ALL your entities so Alembic can "see" them
from src.entities.user import User
from src.entities.trade import Trade
# ---------------------------------------------------------

config = context.config

# 2. OVERRIDE THE DATABASE URL FROM .ENV
# This prevents hardcoding credentials in alembic.ini
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 3. LINK METADATA
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Create engine from config
    connectable = create_engine(settings.DATABASE_URL)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()