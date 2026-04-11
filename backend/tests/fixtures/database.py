from collections.abc import Iterator

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from testcontainers.postgres import PostgresContainer

from backend.infra.persistence.orm.base import Base


@pytest.fixture(scope="session")
def db_engine():
    with PostgresContainer("postgres:17") as postgres:
        url = postgres.get_connection_url()

        # Apply migrations pointing Alembic directly at the container
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", url)
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
