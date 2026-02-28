from fastapi import APIRouter

from backend.api.schemas.pagination import PaginatedResponse
from backend.api.schemas.people import PersonResponse

people_router = APIRouter(prefix="/people", tags=["people"])


@people_router.get("/")
def get_people() -> PaginatedResponse[PersonResponse]:
    return PaginatedResponse(total=0, items=[])
