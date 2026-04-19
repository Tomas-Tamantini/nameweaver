from dataclasses import dataclass

from backend.domain.exceptions import (
    InvalidCredentialsError,
    InvalidTokenError,
)
from backend.domain.repositories.user_repository import UserRepository
from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService


@dataclass(frozen=True)
class TokenPair:
    access_token: str
    refresh_token: str


class AuthService:
    def __init__(
        self,
        user_repo: UserRepository,
        password_hasher: PasswordHasher,
        token_service: TokenService,
    ) -> None:
        self._user_repo = user_repo
        self._password_hasher = password_hasher
        self._token_service = token_service

    def _get_user_by_username_or_email(self, username_or_email: str):
        user = self._user_repo.get_by_email(username_or_email)
        if not user:
            user = self._user_repo.get_by_username(username_or_email)
        return user

    def login(self, username_or_email: str, password: str) -> TokenPair:
        if not (
            user := self._get_user_by_username_or_email(username_or_email)
        ):
            raise InvalidCredentialsError()

        if not self._password_hasher.verify(password, user.hashed_password):
            raise InvalidCredentialsError()

        access_token = self._token_service.create_access_token(
            user_id=user.id,
        )
        refresh_token = self._token_service.create_refresh_token(
            user_id=user.id,
        )
        return TokenPair(
            access_token=access_token, refresh_token=refresh_token
        )

    def get_user_id_from_access_token(self, token: str) -> int:
        return self._extract_user_id(token, expected_type="access")

    def refresh(self, refresh_token: str) -> TokenPair:
        user_id = self._extract_user_id(refresh_token, expected_type="refresh")

        if not self._user_repo.get_by_id(user_id):
            raise InvalidCredentialsError()

        new_access_token = self._token_service.create_access_token(
            user_id=user_id,
        )
        return TokenPair(
            access_token=new_access_token,
            refresh_token=refresh_token,
        )

    def _extract_user_id(self, token: str, *, expected_type: str) -> int:
        payload = self._token_service.decode_token(token)
        if payload.get("type") != expected_type:
            raise InvalidTokenError()
        try:
            return int(payload["sub"])  # type: ignore[arg-type]
        except (KeyError, ValueError, TypeError) as err:
            raise InvalidTokenError() from err
