from dataclasses import asdict

import pytest

from backend.domain.models.person import Person, PersonBase


@pytest.fixture
def person_base(user):
    return PersonBase(
        name="Alice",
        description="A test person",
        user_id=user.id,
    )


@pytest.fixture
def person(person_base):
    return Person(id=1, **asdict(person_base))


@pytest.fixture
def create_person_payload(person_base):
    return {
        "name": person_base.name,
        "description": person_base.description,
    }
