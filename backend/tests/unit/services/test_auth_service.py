from unittest.mock import MagicMock

import pytest

from backend.domain.exceptions import (
    InvalidCredentialsError,
    InvalidTokenError,
)
from backend.domain.models.user import User
from backend.domain.repositories.user_repository import UserRepository
from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService
from backend.domain.services.auth_service import AuthService, TokenPair


@pytest.fixture
def mock_repo():
    return MagicMock(spec=UserRepository)


@pytest.fixture
def mock_hasher():
    hasher = MagicMock(spec=PasswordHasher)
    hasher.verify.return_value = True
    return hasher


@pytest.fixture
def mock_tokens():
    service = MagicMock(spec=TokenService)
    service.create_access_token.return_value = "access-tok"
    service.create_refresh_token.return_value = "refresh-tok"
    return service


@pytest.fixture
def service(mock_repo, mock_hasher, mock_tokens):
    return AuthService(mock_repo, mock_hasher, mock_tokens)


@pytest.fixture
def user():
    return User(
        id=1,
        username="alice",
        email="alice@example.com",
        hashed_password="hashed-password",
    )


def test_login_with_username_returns_token_pair(service, mock_repo, user):
    mock_repo.get_by_username.return_value = user
    result = service.login("alice", "password")
    assert isinstance(result, TokenPair)
    assert result.access_token == "access-tok"
    assert result.refresh_token == "refresh-tok"


def test_login_with_email_calls_get_by_email(service, mock_repo, user):
    mock_repo.get_by_email.return_value = user
    service.login("alice@example.com", "password")
    mock_repo.get_by_email.assert_called_once_with("alice@example.com")
    mock_repo.get_by_username.assert_not_called()


def test_login_with_username_calls_get_by_username(service, mock_repo, user):
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = user
    service.login("alice", "password")
    mock_repo.get_by_email.assert_called_once_with("alice")
    mock_repo.get_by_username.assert_called_once_with("alice")


def test_login_user_not_found_by_username_raises(service, mock_repo):
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = None
    with pytest.raises(InvalidCredentialsError):
        service.login("nonexistent", "password")


def test_login_user_not_found_by_email_raises(service, mock_repo):
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = None
    with pytest.raises(InvalidCredentialsError):
        service.login("nonexistent@example.com", "password")


def test_login_wrong_password_raises(service, mock_repo, mock_hasher, user):
    mock_hasher.verify.return_value = False
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = user
    with pytest.raises(InvalidCredentialsError):
        service.login("alice", "wrong-password")


def test_login_delegates_token_creation_with_user_id(
    service, mock_repo, mock_tokens, user
):
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = user
    service.login("alice", "password")
    mock_tokens.create_access_token.assert_called_once_with(
        user_id=user.id,
    )
    mock_tokens.create_refresh_token.assert_called_once_with(
        user_id=user.id,
    )


def test_login_calls_verify_with_correct_args(
    service, mock_repo, mock_hasher, user
):
    mock_repo.get_by_email.return_value = None
    mock_repo.get_by_username.return_value = user
    service.login("alice", "my-password")
    mock_hasher.verify.assert_called_once_with(
        "my-password", user.hashed_password
    )


# --- refresh tests ---


def test_refresh_returns_new_access_token_and_same_refresh(
    service, mock_tokens, mock_repo, user
):
    mock_tokens.decode_token.return_value = {
        "sub": "1",
        "type": "refresh",
    }
    mock_repo.get_by_id.return_value = user
    mock_tokens.create_access_token.return_value = "new-access"

    result = service.refresh("original-refresh-token")

    assert isinstance(result, TokenPair)
    assert result.access_token == "new-access"
    assert result.refresh_token == "original-refresh-token"


def test_refresh_delegates_decode(service, mock_tokens, mock_repo, user):
    mock_tokens.decode_token.return_value = {
        "sub": "1",
        "type": "refresh",
    }
    mock_repo.get_by_id.return_value = user

    service.refresh("the-token")

    mock_tokens.decode_token.assert_called_once_with("the-token")


def test_refresh_creates_access_token_for_user(
    service, mock_tokens, mock_repo, user
):
    mock_tokens.decode_token.return_value = {
        "sub": "42",
        "type": "refresh",
    }
    mock_repo.get_by_id.return_value = user

    service.refresh("tok")

    mock_tokens.create_access_token.assert_called_once_with(
        user_id=42,
    )


def test_refresh_does_not_create_new_refresh_token(
    service, mock_tokens, mock_repo, user
):
    mock_tokens.decode_token.return_value = {
        "sub": "1",
        "type": "refresh",
    }
    mock_repo.get_by_id.return_value = user

    service.refresh("tok")

    mock_tokens.create_refresh_token.assert_not_called()


def test_refresh_with_access_token_raises(service, mock_tokens):
    mock_tokens.decode_token.return_value = {
        "sub": "1",
        "type": "access",
    }

    with pytest.raises(InvalidTokenError):
        service.refresh("an-access-token")


def test_refresh_with_invalid_token_raises(service, mock_tokens):
    mock_tokens.decode_token.side_effect = InvalidTokenError()

    with pytest.raises(InvalidTokenError):
        service.refresh("garbage")


def test_refresh_with_deleted_user_raises(service, mock_tokens, mock_repo):
    mock_tokens.decode_token.return_value = {
        "sub": "999",
        "type": "refresh",
    }
    mock_repo.get_by_id.return_value = None

    with pytest.raises(InvalidCredentialsError):
        service.refresh("tok")
