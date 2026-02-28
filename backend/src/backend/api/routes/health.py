from fastapi import APIRouter

health_router = APIRouter(prefix="/health", tags=["health"])


@health_router.get("/")
def health() -> dict[str, str]:
    return {"status": "ok"}
