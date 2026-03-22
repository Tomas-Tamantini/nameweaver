from unittest.mock import MagicMock

import pytest

from backend.domain.repositories.person_repository import PersonRepository


@pytest.fixture
def mock_person_repository(person) -> MagicMock:
    repo = MagicMock(spec=PersonRepository)
    repo.create.return_value = person
    return repo
