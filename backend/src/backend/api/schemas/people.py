from typing import Annotated, Optional

from fastapi import Query
from pydantic import BaseModel, Field, NonNegativeInt, PositiveInt

from backend.domain.models.pagination import PaginationQueryParams
from backend.domain.models.person import FilterPeopleQueryParams, Person

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
        return PersonResponse(
            id=person.id, name=person.name, description=person.description
        )


class GetPeopleQueryParams(BaseModel):
    offset: Annotated[
        NonNegativeInt, Query(description="Number of items to skip")
    ] = 0
    limit: Annotated[
        PositiveInt,
        Query(description="Maximum number of items to return", le=100),
    ] = 10
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
