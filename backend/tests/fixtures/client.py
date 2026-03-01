import pytest
from fastapi.testclient import TestClient

from backend.app import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def integration_client() -> TestClient:
    return TestClient(app)
