from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from backend.api.dependencies.repositories import get_person_repository
from backend.app import app
from backend.infra.persistence.database import get_db_session


@pytest.fixture
def client(mock_person_repository) -> Iterator[TestClient]:
    app.dependency_overrides[get_person_repository] = lambda: (
        mock_person_repository
    )
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def integration_client(db_session) -> Iterator[TestClient]:
    app.dependency_overrides[get_db_session] = lambda: db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
