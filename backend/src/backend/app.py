from http import HTTPStatus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.routes import all_routers
from backend.domain.exceptions import EntityNotFoundError
from backend.settings import get_settings

app = FastAPI()
allow_origins = list(map(str.strip, get_settings().ALLOWED_ORIGINS.split(",")))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(EntityNotFoundError)
def handle_entity_not_found(
    _request: object, exc: EntityNotFoundError
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND,
        content={"detail": str(exc)},
    )


for router in all_routers:
    app.include_router(router)
