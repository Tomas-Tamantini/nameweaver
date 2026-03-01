import pytest


@pytest.fixture
def create_person_payload():
    return {"name": "Alice", "description": "A test person"}
