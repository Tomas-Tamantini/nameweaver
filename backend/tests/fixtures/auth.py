from unittest.mock import MagicMock

import pytest

from backend.domain.security.password_hasher import PasswordHasher


@pytest.fixture
def mock_password_hasher() -> MagicMock:
    hasher = MagicMock(spec=PasswordHasher)
    hasher.hash.side_effect = lambda pw: f"hashed-{pw}"
    hasher.verify.return_value = True
    return hasher
