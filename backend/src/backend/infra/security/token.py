from datetime import datetime, timedelta, timezone

import jwt

from backend.domain.exceptions import InvalidTokenError
from backend.domain.security.token_service import TokenService


class JwtTokenService(TokenService):
    def __init__(
        self,
        secret: str,
        algorithm: str,
        access_token_expire_minutes: int,
        refresh_token_expire_minutes: int,
    ) -> None:
        self._secret = secret
        self._algorithm = algorithm
        self._access_expire = access_token_expire_minutes
        self._refresh_expire = refresh_token_expire_minutes

    def create_access_token(self, user_id: int) -> str:
        return self._create_token(
            user_id, self._access_expire, token_type="access"
        )

    def create_refresh_token(self, user_id: int) -> str:
        return self._create_token(
            user_id, self._refresh_expire, token_type="refresh"
        )

    def decode_token(self, token: str) -> dict[str, object]:
        try:
            return jwt.decode(
                token, self._secret, algorithms=[self._algorithm]
            )
        except jwt.PyJWTError as err:
            raise InvalidTokenError() from err

    def _create_token(
        self,
        user_id: int,
        expire_minutes: int,
        token_type: str,
    ) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
        payload = {
            "sub": str(user_id),
            "exp": expire,
            "type": token_type,
        }
        return jwt.encode(payload, self._secret, algorithm=self._algorithm)
