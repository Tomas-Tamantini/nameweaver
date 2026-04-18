from unittest.mock import MagicMock

import pytest

from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService
from backend.domain.services.auth_service import AuthService, TokenPair


@pytest.fixture
def mock_auth_service() -> MagicMock:
    service = MagicMock(spec=AuthService)
    service.login.return_value = TokenPair(
        access_token="test-access-token",
        refresh_token="test-refresh-token",
    )
    return service


@pytest.fixture
def mock_password_hasher() -> MagicMock:
    hasher = MagicMock(spec=PasswordHasher)
    hasher.hash.side_effect = lambda pw: f"hashed-{pw}"
    hasher.verify.return_value = True
    return hasher


@pytest.fixture
def mock_token_service() -> MagicMock:
    service = MagicMock(spec=TokenService)
    service.create_access_token.return_value = "access-tok"
    service.create_refresh_token.return_value = "refresh-tok"
    return service
