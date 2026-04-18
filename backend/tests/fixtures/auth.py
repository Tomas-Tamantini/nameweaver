from unittest.mock import MagicMock

import pytest

from backend.domain.security.password_hasher import PasswordHasher
from backend.domain.security.token_service import TokenService


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
