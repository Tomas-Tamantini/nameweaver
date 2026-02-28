from typing import Annotated, Optional

from fastapi import Query
from pydantic import BaseModel, Field

from backend.api.schemas.pagination import PaginationQueryParams

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


class GetPeopleQueryParams(PaginationQueryParams):
    q: Annotated[
        Optional[str],
        Query(
            description="Search query to filter people by name or description",
            examples=["mathematician", "Ada"],
        ),
    ] = None
