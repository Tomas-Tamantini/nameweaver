from unittest.mock import MagicMock

import pytest

from backend.domain.repositories.person_repository import PersonRepository
from backend.domain.repositories.user_repository import UserRepository


@pytest.fixture
def mock_person_repository(person) -> MagicMock:
    repo = MagicMock(spec=PersonRepository)
    repo.create.return_value = person
    repo.get_by_id.return_value = person
    return repo


@pytest.fixture
def mock_user_repository(user) -> MagicMock:
    repo = MagicMock(spec=UserRepository)
    repo.create.return_value = user
    repo.get_by_username.return_value = user
    return repo
