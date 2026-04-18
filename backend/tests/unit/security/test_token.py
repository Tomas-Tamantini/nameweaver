from datetime import datetime, timezone

import jwt
import pytest
import time_machine

from backend.domain.exceptions import InvalidTokenError
from backend.infra.security.token import JwtTokenService

SECRET = "test-secret-at-least-32-bytes-long!!"
ALGORITHM = "HS256"


@pytest.fixture
def token_service():
    return JwtTokenService(
        secret=SECRET,
        algorithm=ALGORITHM,
        access_token_expire_minutes=15,
        refresh_token_expire_minutes=60,
    )


def test_create_access_token_is_decodable(token_service):
    token = token_service.create_access_token(user_id=1)
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "1"
    assert payload["type"] == "access"


def test_create_refresh_token_is_decodable(token_service):
    token = token_service.create_refresh_token(user_id=1)
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "1"
    assert payload["type"] == "refresh"


@time_machine.travel("2025-01-01T12:00:00Z", tick=False)
def test_create_access_token_expires_after_configured_minutes(
    token_service,
):
    token = token_service.create_access_token(user_id=1)
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    expected = datetime(2025, 1, 1, 12, 15, tzinfo=timezone.utc)
    assert payload["exp"] == int(expected.timestamp())


@time_machine.travel("2025-01-01T12:00:00Z", tick=False)
def test_create_refresh_token_expires_after_configured_minutes(
    token_service,
):
    token = token_service.create_refresh_token(user_id=1)
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    expected = datetime(2025, 1, 1, 13, 0, tzinfo=timezone.utc)
    assert payload["exp"] == int(expected.timestamp())


def test_decode_token_returns_payload(token_service):
    token = token_service.create_access_token(user_id=42)
    payload = token_service.decode_token(token)
    assert payload["sub"] == "42"
    assert payload["type"] == "access"


def test_decode_token_with_invalid_token_raises(token_service):
    with pytest.raises(InvalidTokenError):
        token_service.decode_token("not-a-real-token")


@time_machine.travel("2025-01-01T12:00:00Z", tick=False)
def test_decode_token_with_expired_token_raises():
    service = JwtTokenService(
        secret=SECRET,
        algorithm=ALGORITHM,
        access_token_expire_minutes=1,
        refresh_token_expire_minutes=1,
    )
    token = service.create_access_token(user_id=1)

    # Jump past expiration
    with time_machine.travel("2025-01-01T12:02:00Z", tick=False):
        with pytest.raises(InvalidTokenError):
            service.decode_token(token)


def test_decode_token_with_wrong_secret_raises(token_service):
    token = token_service.create_access_token(user_id=1)
    other_service = JwtTokenService(
        secret="other-secret-at-least-32-bytes-long!!",
        algorithm=ALGORITHM,
        access_token_expire_minutes=15,
        refresh_token_expire_minutes=60,
    )
    with pytest.raises(InvalidTokenError):
        other_service.decode_token(token)
