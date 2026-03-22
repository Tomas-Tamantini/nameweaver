from typing import Annotated

from fastapi import APIRouter, Depends

from backend.domain.repositories.person_repository import PersonRepository
from backend.infra.persistence.repositories.person_repository import (
    FakePersonRepository,
)

people_router = APIRouter(prefix="/people", tags=["people"])


def get_person_repository() -> PersonRepository:
    return FakePersonRepository()


T_PersonRepository = Annotated[
    PersonRepository, Depends(get_person_repository)
]
