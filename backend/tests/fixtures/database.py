import os
from collections.abc import Iterator

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from testcontainers.postgres import PostgresContainer

from backend.infra.persistence.orm.base import Base
from backend.settings import get_settings


@pytest.fixture(scope="session")
def db_engine():
    with PostgresContainer("postgres:17") as postgres:
        url = postgres.get_connection_url()
        # Point settings to the container so Alembic migrations work
        os.environ["DATABASE_URL"] = url
        get_settings.cache_clear()

        # Apply migrations (same path as production)
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")

        engine = create_engine(url)
        yield engine
        engine.dispose()


@pytest.fixture
def db_session(db_engine) -> Iterator[Session]:
    session_factory = sessionmaker(bind=db_engine)
    session = session_factory()
    try:
        yield session
        session.commit()
    finally:
        session.rollback()
        # Clean all tables between tests for isolation
        for table in reversed(Base.metadata.sorted_tables):
            session.execute(table.delete())
        session.commit()
        session.close()
