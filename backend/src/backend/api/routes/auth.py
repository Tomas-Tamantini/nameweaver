from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from backend.api.schemas.auth import RefreshRequest, TokenResponse

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", status_code=HTTPStatus.OK)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> TokenResponse:
    raise NotImplementedError


@auth_router.post("/refresh", status_code=HTTPStatus.OK)
def refresh(body: RefreshRequest) -> TokenResponse:
    raise NotImplementedError
