from typing import Annotated

from fastapi import Depends
from pwdlib import PasswordHash

from backend.api.dependencies.repositories import get_user_repository
from backend.domain.repositories.user_repository import UserRepository
from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService
from backend.domain.services.auth_service import AuthService
from backend.infra.security.token import JwtTokenService
from backend.settings import Settings, get_settings


def get_password_hasher() -> PasswordHasher:
    return PasswordHash.recommended()


def get_token_service(
    settings: Settings = Depends(get_settings),
) -> TokenService:
    return JwtTokenService(
        secret=settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
        access_token_expire_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        refresh_token_expire_minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES,
    )


def get_auth_service(
    repo: UserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher),
    token_service: TokenService = Depends(get_token_service),
) -> AuthService:
    return AuthService(repo, password_hasher, token_service)


T_AuthService = Annotated[AuthService, Depends(get_auth_service)]
T_PasswordHasher = Annotated[PasswordHasher, Depends(get_password_hasher)]
