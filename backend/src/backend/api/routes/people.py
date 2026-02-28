from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.schemas.pagination import (
    PaginatedResponse,
)
from backend.api.schemas.people import (
    CreatePersonRequest,
    GetPeopleQueryParams,
    PersonResponse,
)

people_router = APIRouter(prefix="/people", tags=["people"])

_fake_people_db = [
    {
        "id": 1,
        "name": "Ada Lovelace",
        "description": "English mathematician and writer, known for her work "
        "on Charles Babbage's early mechanical general-purpose computer.",
    },
    {
        "id": 2,
        "name": "Alan Turing",
        "description": "English mathematician, computer scientist, logician, "
        "cryptanalyst, philosopher, and theoretical biologist.",
    },
    {
        "id": 3,
        "name": "Grace Hopper",
        "description": "American computer scientist and United States "
        "Navy rear admiral. She was a pioneer of computer programming.",
    },
    {
        "id": 4,
        "name": "Katherine Johnson",
        "description": "American mathematician whose calculations of orbital "
        "mechanics were critical to the success of crewed spaceflights.",
    },
    {
        "id": 5,
        "name": "Tim Berners-Lee",
        "description": "English engineer and computer scientist, "
        "best known as the inventor of the World Wide Web.",
    },
]


@people_router.post("/", status_code=HTTPStatus.CREATED)
def create_person(body: CreatePersonRequest) -> PersonResponse:
    new_id = max(person["id"] for person in _fake_people_db) + 1
    new_person = {
        "id": new_id,
        "name": body.name,
        "description": body.description,
    }
    _fake_people_db.append(new_person)
    return PersonResponse(**new_person)


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
) -> PaginatedResponse[PersonResponse]:
    filtered_people = _fake_people_db
    if query_params.q:
        q_lower = query_params.q.lower()
        filtered_people = [
            person
            for person in _fake_people_db
            if q_lower in person["name"].lower()
            or q_lower in person["description"].lower()
        ]

    paginated_people = filtered_people[
        query_params.offset : query_params.offset + query_params.limit
    ]
    return PaginatedResponse(
        total=len(filtered_people),
        items=[PersonResponse(**person) for person in paginated_people],
    )
