from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from backend.api.dependencies.services import T_AuthService
from backend.api.schemas.auth import RefreshRequest, TokenResponse

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", status_code=HTTPStatus.OK)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: T_AuthService,
) -> TokenResponse:
    token_pair = auth_service.login(
        username_or_email=form_data.username, password=form_data.password
    )
    return TokenResponse(
        access_token=token_pair.access_token,
        refresh_token=token_pair.refresh_token,
    )


@auth_router.post("/refresh", status_code=HTTPStatus.OK)
def refresh(
    body: RefreshRequest, auth_service: T_AuthService
) -> TokenResponse:
    token_pair = auth_service.refresh(refresh_token=body.refresh_token)
    return TokenResponse(
        access_token=token_pair.access_token,
        refresh_token=token_pair.refresh_token,
    )
