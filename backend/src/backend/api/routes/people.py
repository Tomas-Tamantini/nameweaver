from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.dependencies.services import T_CurrentUserId, T_PersonService
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
    service: T_PersonService,
    user_id: T_CurrentUserId,
) -> PersonResponse:
    new_person = service.create(
        PersonBase(
            name=body.name, description=body.description, user_id=user_id
        )
    )
    return PersonResponse.from_domain(new_person)


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
    service: T_PersonService,
    user_id: T_CurrentUserId,
) -> PaginatedResponse[PersonResponse]:
    result = service.get_many(
        pagination=query_params.pagination(),
        filters=query_params.filters(user_id=user_id),
    )
    return PaginatedResponse(
        total=result.total,
        items=[PersonResponse.from_domain(p) for p in result.items],
    )


@people_router.get("/{person_id}")
def get_person(
    person_id: int, service: T_PersonService, user_id: T_CurrentUserId
) -> PersonResponse:
    person = service.get_by_id(user_id=user_id, person_id=person_id)
    return PersonResponse.from_domain(person)


@people_router.delete("/{person_id}", status_code=HTTPStatus.NO_CONTENT)
def delete_person(
    person_id: int, service: T_PersonService, user_id: T_CurrentUserId
) -> None:
    service.delete(user_id=user_id, person_id=person_id)
