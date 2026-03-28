from collections.abc import Iterator

from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.infra.persistence.orm.base import Base
from backend.settings import get_settings

_settings = get_settings()
_engine_kwargs = (
    {"connect_args": {"check_same_thread": False}, "poolclass": StaticPool}
    if _settings.DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(_settings.DATABASE_URL, **_engine_kwargs)


SessionLocal = sessionmaker(bind=engine)


def create_tables() -> None:
    Base.metadata.create_all(engine)


def get_db_session() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
