from http import HTTPStatus

from fastapi import APIRouter

from backend.api.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    TokenResponse,
)

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", status_code=HTTPStatus.OK)
def login(body: LoginRequest) -> TokenResponse:
    raise NotImplementedError


@auth_router.post("/refresh", status_code=HTTPStatus.OK)
def refresh(body: RefreshRequest) -> TokenResponse:
    raise NotImplementedError
