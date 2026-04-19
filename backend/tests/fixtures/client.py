from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from backend.api.dependencies.repositories import (
    get_person_repository,
    get_user_repository,
)
from backend.api.dependencies.services import (
    get_auth_service,
    get_current_user_id,
    get_password_hasher,
)
from backend.app import create_app
from backend.infra.persistence.database import get_db_session
from backend.settings import Settings


def _test_settings() -> Settings:
    return Settings(
        DATABASE_URL="sqlite://",
        ALLOWED_ORIGINS="http://localhost",
        JWT_SECRET="test-secret-not-for-production",
    )


@pytest.fixture
def client(
    mock_person_repository,
    mock_user_repository,
    mock_auth_service,
    mock_password_hasher,
) -> Iterator[TestClient]:
    test_app = create_app(_test_settings())
    test_app.dependency_overrides[get_person_repository] = lambda: (
        mock_person_repository
    )
    test_app.dependency_overrides[get_user_repository] = lambda: (
        mock_user_repository
    )
    test_app.dependency_overrides[get_auth_service] = lambda: mock_auth_service
    test_app.dependency_overrides[get_password_hasher] = lambda: (
        mock_password_hasher
    )
    test_app.dependency_overrides[get_current_user_id] = lambda: 1
    yield TestClient(test_app)
    test_app.dependency_overrides.clear()


@pytest.fixture
def unauthenticated_client(
    mock_person_repository,
    mock_user_repository,
) -> Iterator[TestClient]:
    test_app = create_app(_test_settings())
    test_app.dependency_overrides[get_person_repository] = lambda: (
        mock_person_repository
    )
    test_app.dependency_overrides[get_user_repository] = lambda: (
        mock_user_repository
    )
    yield TestClient(test_app)
    test_app.dependency_overrides.clear()


@pytest.fixture
def integration_client(db_session) -> Iterator[TestClient]:
    test_app = create_app(_test_settings())
    test_app.dependency_overrides[get_db_session] = lambda: db_session
    test_app.dependency_overrides[get_current_user_id] = lambda: 1
    with TestClient(test_app) as test_client:
        yield test_client
    test_app.dependency_overrides.clear()
