from http import HTTPStatus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.routes import all_routers
from backend.domain.exceptions import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from backend.settings import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    if settings is None:
        settings = get_settings()

    created_app = FastAPI()
    allow_origins = list(map(str.strip, settings.ALLOWED_ORIGINS.split(",")))

    created_app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @created_app.exception_handler(EntityNotFoundError)
    def handle_entity_not_found(
        _request: object, exc: EntityNotFoundError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={"detail": str(exc)},
        )

    @created_app.exception_handler(EntityAlreadyExistsError)
    def handle_entity_already_exists(
        _request: object, exc: EntityAlreadyExistsError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=HTTPStatus.CONFLICT,
            content={"detail": str(exc)},
        )

    for router in all_routers:
        created_app.include_router(router)

    return created_app
