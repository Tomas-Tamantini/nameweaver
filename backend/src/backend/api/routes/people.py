from fastapi import APIRouter

people_router = APIRouter(prefix="/people", tags=["people"])


@people_router.get("/")
def get_people():
    return []
