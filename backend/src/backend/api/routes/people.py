from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.schemas.people import (
    CreatePersonRequest,
    GetPeopleQueryParams,
    PersonResponse,
)
from backend.domain.models.pagination import (
    PaginatedResponse,
)
from backend.domain.models.person import PersonBase
from backend.infra.persistence.repositories.person_repository import (
    FakePersonRepository,
)

people_router = APIRouter(prefix="/people", tags=["people"])

repository = FakePersonRepository()


@people_router.post("/", status_code=HTTPStatus.CREATED)
def create_person(body: CreatePersonRequest) -> PersonResponse:
    parsed = PersonBase(name=body.name, description=body.description)
    new_person = repository.create(parsed)
    return PersonResponse.from_domain(new_person)


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
) -> PaginatedResponse[PersonResponse]:
    result = repository.get_many(
        pagination=query_params.pagination(), filter=query_params.filter()
    )
    return PaginatedResponse(
        total=result.total,
        items=[PersonResponse.from_domain(p) for p in result.items],
    )
