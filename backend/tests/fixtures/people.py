from dataclasses import asdict

import pytest

from backend.domain.models.person import Person, PersonBase


@pytest.fixture
def person_base():
    return PersonBase(name="Alice", description="A test person")


@pytest.fixture
def person(person_base):
    return Person(id=1, **asdict(person_base))


@pytest.fixture
def create_person_payload(person_base):
    return asdict(person_base)
