from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from backend.domain.repositories.person_repository import PersonRepository
from backend.infra.persistence.database import get_db_session
from backend.infra.persistence.repositories.sql_person_repository import (
    SqlPersonRepository,
)


def get_person_repository(
    session: Session = Depends(get_db_session),
) -> Iterator[PersonRepository]:
    yield SqlPersonRepository(session)


T_PersonRepository = Annotated[
    PersonRepository, Depends(get_person_repository)
]
