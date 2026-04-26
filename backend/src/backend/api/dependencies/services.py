from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash

from backend.api.dependencies.repositories import (
    get_person_repository,
    get_user_repository,
)
from backend.domain.repositories.person_repository import PersonRepository
from backend.domain.repositories.user_repository import UserRepository
from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService
from backend.domain.services.auth_service import AuthService
from backend.domain.services.person_service import PersonService
from backend.infra.security.token import JwtTokenService
from backend.settings import Settings, get_settings

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


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


def get_person_service(
    repo: PersonRepository = Depends(get_person_repository),
) -> PersonService:
    return PersonService(repo)


def get_current_user_id(
    token: str = Depends(_oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
) -> int:
    return auth_service.get_user_id_from_access_token(token)


T_AuthService = Annotated[AuthService, Depends(get_auth_service)]
T_PersonService = Annotated[PersonService, Depends(get_person_service)]
T_PasswordHasher = Annotated[PasswordHasher, Depends(get_password_hasher)]
T_CurrentUserId = Annotated[int, Depends(get_current_user_id)]
