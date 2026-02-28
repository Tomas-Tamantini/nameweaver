from typing import Annotated, Optional

from fastapi import Query
from pydantic import BaseModel, Field

from backend.api.schemas.pagination import PaginationQueryParams


class CreatePersonRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    description: Annotated[str, Field(min_length=1, max_length=280)]


class PersonResponse(BaseModel):
    id: int
    name: Annotated[str, Field(min_length=1, max_length=100)]
    description: Annotated[str, Field(min_length=1, max_length=280)]


class GetPeopleQueryParams(PaginationQueryParams):
    q: Annotated[
        Optional[str],
        Query(
            description="Search query to filter people by name or description",
            example="John",
        ),
    ] = None
