from collections.abc import Iterator

from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.infra.persistence.orm.base import Base

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

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
