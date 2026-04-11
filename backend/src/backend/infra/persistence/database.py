from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import StaticPool, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from backend.settings import get_settings


@lru_cache
def _get_engine() -> Engine:
    settings = get_settings()
    engine_kwargs = (
        {"connect_args": {"check_same_thread": False}, "poolclass": StaticPool}
        if settings.DATABASE_URL.startswith("sqlite")
        else {}
    )
    return create_engine(settings.DATABASE_URL, **engine_kwargs)


@lru_cache
def _get_session_factory() -> sessionmaker[Session]:
    return sessionmaker(bind=_get_engine())


def get_db_session() -> Iterator[Session]:
    session = _get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
