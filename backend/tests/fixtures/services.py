from unittest.mock import MagicMock

import pytest

from backend.domain.models.pagination import PaginatedResponse
from backend.domain.services.person_service import PersonService


@pytest.fixture
def mock_person_service(person) -> MagicMock:
    service = MagicMock(spec=PersonService)
    service.create.return_value = person
    service.get_many.return_value = PaginatedResponse(
        total=1,
        items=[person],
    )
    service.get_by_id.return_value = person
    service.update.return_value = person
    return service
