from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.dependencies.repositories import T_PersonRepository
from backend.api.dependencies.services import T_CurrentUserId
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
    body: CreatePersonRequest,
    repo: T_PersonRepository,
    user_id: T_CurrentUserId,
) -> PersonResponse:
    parsed = PersonBase(name=body.name, description=body.description)
    new_person = repo.create(parsed)
    return PersonResponse.from_domain(new_person)


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
    repo: T_PersonRepository,
    user_id: T_CurrentUserId,
) -> PaginatedResponse[PersonResponse]:
    result = repo.get_many(
        pagination=query_params.pagination(), filters=query_params.filters()
    )
    return PaginatedResponse(
        total=result.total,
        items=[PersonResponse.from_domain(p) for p in result.items],
    )


@people_router.get("/{person_id}")
def get_person(
    person_id: int, repo: T_PersonRepository, user_id: T_CurrentUserId
) -> PersonResponse:
    person = repo.get_by_id(person_id)
    return PersonResponse.from_domain(person)


@people_router.delete("/{person_id}", status_code=HTTPStatus.NO_CONTENT)
def delete_person(
    person_id: int, repo: T_PersonRepository, user_id: T_CurrentUserId
) -> None:
    repo.delete(person_id)
