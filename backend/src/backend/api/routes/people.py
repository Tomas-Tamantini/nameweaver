from typing import Annotated

from fastapi import APIRouter, Query

from backend.api.schemas.pagination import (
    PaginatedResponse,
)
from backend.api.schemas.people import GetPeopleQueryParams, PersonResponse

people_router = APIRouter(prefix="/people", tags=["people"])


@people_router.get("/")
def get_people(
    query_params: Annotated[GetPeopleQueryParams, Query()],
) -> PaginatedResponse[PersonResponse]:
    return PaginatedResponse(total=0, items=[])
