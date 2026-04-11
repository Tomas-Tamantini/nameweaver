from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from backend.domain.repositories.person_repository import PersonRepository
from backend.domain.repositories.user_repository import UserRepository
from backend.infra.persistence.database import get_db_session
from backend.infra.persistence.repositories.sql_person_repository import (
    SqlPersonRepository,
)
from backend.infra.persistence.repositories.sql_user_repository import (
    SqlUserRepository,
)


def get_person_repository(
    session: Session = Depends(get_db_session),
) -> Iterator[PersonRepository]:
    yield SqlPersonRepository(session)


T_PersonRepository = Annotated[
    PersonRepository, Depends(get_person_repository)
]


def get_user_repository(
    session: Session = Depends(get_db_session),
) -> Iterator[UserRepository]:
    yield SqlUserRepository(session)


T_UserRepository = Annotated[UserRepository, Depends(get_user_repository)]
