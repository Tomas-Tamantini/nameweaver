from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from backend.api.dependencies.repositories import get_person_repository
from backend.app import app


@pytest.fixture
def client(mock_person_repository) -> Iterator[TestClient]:
    app.dependency_overrides[get_person_repository] = lambda: (
        mock_person_repository
    )
    yield TestClient(app)
    app.dependency_overrides.pop(get_person_repository, None)


@pytest.fixture
def integration_client() -> TestClient:
    return TestClient(app)
