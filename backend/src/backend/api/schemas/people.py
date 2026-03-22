from dataclasses import asdict
from typing import Annotated, Optional

from fastapi import Query
from pydantic import BaseModel, Field

from backend.domain.models.pagination import PaginationQueryParams
from backend.domain.models.person import Person
from backend.domain.repositories.person_repository import (
    FilterPeopleQueryParams,
)

_EXAMPLE_NAME = "Ada Lovelace"
_EXAMPLE_DESCRIPTION = "English mathematician and writer"


class CreatePersonRequest(BaseModel):
    name: Annotated[
        str, Field(min_length=1, max_length=100, examples=[_EXAMPLE_NAME])
    ]
    description: Annotated[
        str,
        Field(
            min_length=1,
            max_length=280,
            examples=[_EXAMPLE_DESCRIPTION],
        ),
    ]


class PersonResponse(BaseModel):
    id: int
    name: Annotated[
        str, Field(min_length=1, max_length=100, examples=[_EXAMPLE_NAME])
    ]
    description: Annotated[
        str,
        Field(
            min_length=1,
            max_length=280,
            examples=[_EXAMPLE_DESCRIPTION],
        ),
    ]

    @staticmethod
    def from_domain(person: Person) -> "PersonResponse":
        return PersonResponse(**asdict(person))


class GetPeopleQueryParams(PaginationQueryParams):
    name: Annotated[
        Optional[str],
        Query(
            description="Filter people by name "
            "(case-insensitive substring match)",
            examples=["Ada"],
        ),
    ] = None
    description: Annotated[
        Optional[str],
        Query(
            description="Filter people by description "
            "(case-insensitive substring match)",
            examples=["mathematician"],
        ),
    ] = None

    def pagination(self) -> PaginationQueryParams:
        return PaginationQueryParams(limit=self.limit, offset=self.offset)

    def filter(self) -> FilterPeopleQueryParams:
        return FilterPeopleQueryParams(
            name=self.name, description=self.description
        )
