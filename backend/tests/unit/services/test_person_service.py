from unittest.mock import MagicMock

import pytest

from backend.domain.exceptions import EntityNotFoundError
from backend.domain.models.pagination import PaginationQueryParams
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
)
from backend.domain.repositories.person_repository import PersonRepository
from backend.domain.services.person_service import PersonService


def _person(person_id: int = 1, user_id: int = 1) -> Person:
    return Person(
        id=person_id,
        name="Alice",
        description="A test person",
        user_id=user_id,
    )


def test_create_builds_person_with_user_id_and_delegates():
    repo = MagicMock(spec=PersonRepository)
    repo.create.return_value = _person()
    service = PersonService(repo)
    person = PersonBase(name="Alice", description="desc", user_id=1)

    created = service.create(person)

    assert created.user_id == 1
    repo.create.assert_called_once_with(person)


def test_get_many_delegates_with_user_id_scope():
    repo = MagicMock(spec=PersonRepository)
    service = PersonService(repo)
    pagination = PaginationQueryParams(offset=0, limit=10)
    filters = FilterPeopleQueryParams(
        name=None,
        description=None,
        user_id=5,
    )

    service.get_many(pagination=pagination, filters=filters)

    repo.get_many.assert_called_once_with(
        pagination=pagination,
        filters=filters,
    )


def test_get_by_id_delegates_with_user_id_scope():
    repo = MagicMock(spec=PersonRepository)
    repo.get_by_id.return_value = _person(person_id=9, user_id=5)
    service = PersonService(repo)

    found = service.get_by_id(user_id=5, person_id=9)

    assert found.id == 9
    repo.get_by_id.assert_called_once_with(person_id=9)


def test_delete_delegates_with_user_id_scope():
    repo = MagicMock(spec=PersonRepository)
    repo.get_by_id.return_value = _person(person_id=3, user_id=7)
    service = PersonService(repo)

    service.delete(user_id=7, person_id=3)

    repo.delete.assert_called_once_with(person_id=3)


def test_get_by_id_raises_not_found_for_non_owner():
    repo = MagicMock(spec=PersonRepository)
    repo.get_by_id.return_value = _person(person_id=9, user_id=2)
    service = PersonService(repo)

    with pytest.raises(EntityNotFoundError, match="Person with id 9"):
        service.get_by_id(user_id=1, person_id=9)


def test_delete_raises_not_found_for_non_owner():
    repo = MagicMock(spec=PersonRepository)
    repo.get_by_id.return_value = _person(person_id=3, user_id=2)
    service = PersonService(repo)

    with pytest.raises(EntityNotFoundError, match="Person with id 3"):
        service.delete(user_id=1, person_id=3)

    repo.delete.assert_not_called()
