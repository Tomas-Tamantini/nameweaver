from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.dependencies.repositories import T_PersonRepository
from backend.api.schemas.people import (
    CreatePersonRequest,
    GetPeopleQueryParams,
    PersonResponse,
)
from backend.domain.models.pagination import PaginatedResponse
from backend.domain.models.person import PersonBase

people_router = APIRouter(prefix="/people", tags=["people"])


@people_router.post("/", status_code=HTTPStatus.CREATED)
def create_person(
    body: CreatePersonRequest, repo: T_PersonRepository
) -> PersonResponse:
    parsed = PersonBase(name=body.name, description=body.description)
    new_person = repo.create(parsed)
    return PersonResponse.from_domain(new_person)


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
    repo: T_PersonRepository,
) -> PaginatedResponse[PersonResponse]:
    result = repo.get_many(
        pagination=query_params.pagination(), filters=query_params.filters()
    )
    return PaginatedResponse(
        total=result.total,
        items=[PersonResponse.from_domain(p) for p in result.items],
    )
