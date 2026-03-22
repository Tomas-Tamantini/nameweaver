from dataclasses import asdict

import pytest

from backend.domain.models.person import Person


@pytest.fixture
def person():
    return Person(id=1, name="Alice", description="A test person")


@pytest.fixture
def create_person_payload(person):
    return asdict(person)
