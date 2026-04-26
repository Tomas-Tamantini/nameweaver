import pytest

from backend.domain.exceptions import EntityNotFoundError
from backend.domain.models.pagination import PaginationQueryParams
from backend.domain.models.person import FilterPeopleQueryParams, PersonBase
from backend.infra.persistence.orm.user import UserModel
from backend.infra.persistence.repositories.sql_person_repository import (
    SqlPersonRepository,
)

pytestmark = pytest.mark.integration


def _make_repo(db_session):
    return SqlPersonRepository(db_session)


def _create_user(db_session) -> UserModel:
    user = UserModel(
        username="repo-user",
        email="repo-user@example.com",
        hashed_password="repo-hash",
    )
    db_session.add(user)
    db_session.flush()
    return user


def _create_person(
    repo,
    user_id,
    name="Alice",
    description="A test person",
):
    return repo.create(
        PersonBase(name=name, description=description, user_id=user_id)
    )


def test_create_returns_person_with_generated_id(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    person = _create_person(repo, user_id=user.id)
    assert person.id is not None
    assert person.name == "Alice"
    assert person.description == "A test person"
    assert person.user_id == user.id


def test_create_sequential_ids(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    first = _create_person(repo, user_id=user.id)
    second = _create_person(repo, user_id=user.id, name="Bob")
    assert second.id == first.id + 1


def test_get_many_empty_table_returns_zero_total(db_session):
    repo = _make_repo(db_session)
    result = repo.get_many(
        PaginationQueryParams(),
        FilterPeopleQueryParams(name=None, description=None),
    )
    assert result.total == 0
    assert result.items == []


def test_get_many_returns_all_created_people(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    _create_person(repo, user_id=user.id, name="Alice")
    _create_person(repo, user_id=user.id, name="Bob")
    result = repo.get_many(
        PaginationQueryParams(),
        FilterPeopleQueryParams(name=None, description=None),
    )
    assert result.total == 2
    assert len(result.items) == 2


def test_get_many_pagination_offset_and_limit(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    for i in range(5):
        _create_person(repo, user_id=user.id, name=f"Person {i}")
    result = repo.get_many(
        PaginationQueryParams(offset=2, limit=2),
        FilterPeopleQueryParams(name=None, description=None),
    )
    assert result.total == 5
    assert len(result.items) == 2
    assert result.items[0].name == "Person 2"


def test_get_many_limit_exceeding_total_returns_remaining(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    _create_person(repo, user_id=user.id, name="Only One")
    result = repo.get_many(
        PaginationQueryParams(offset=0, limit=10),
        FilterPeopleQueryParams(name=None, description=None),
    )
    assert result.total == 1
    assert len(result.items) == 1


def test_get_many_filter_by_name_case_insensitive(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    _create_person(repo, user_id=user.id, name="Ada Lovelace")
    _create_person(repo, user_id=user.id, name="Alan Turing")
    _create_person(repo, user_id=user.id, name="Grace Hopper")
    result = repo.get_many(
        PaginationQueryParams(),
        FilterPeopleQueryParams(name="al", description=None),
    )
    assert result.total == 1
    assert result.items[0].name == "Alan Turing"


def test_get_many_filter_by_description_case_insensitive(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    _create_person(
        repo,
        user_id=user.id,
        name="Ada",
        description="English mathematician",
    )
    _create_person(
        repo,
        user_id=user.id,
        name="Grace",
        description="American computer scientist",
    )
    result = repo.get_many(
        PaginationQueryParams(),
        FilterPeopleQueryParams(name=None, description="english"),
    )
    assert result.total == 1
    assert result.items[0].name == "Ada"


def test_get_many_filter_by_name_and_description(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    _create_person(
        repo,
        user_id=user.id,
        name="Ada",
        description="English mathematician",
    )
    _create_person(
        repo,
        user_id=user.id,
        name="Alan",
        description="English computer scientist",
    )
    _create_person(
        repo,
        user_id=user.id,
        name="Grace",
        description="American computer scientist",
    )
    result = repo.get_many(
        PaginationQueryParams(),
        FilterPeopleQueryParams(name="al", description="computer scientist"),
    )
    assert result.total == 1
    assert result.items[0].name == "Alan"


def test_get_many_filters_with_pagination(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    for i in range(5):
        _create_person(repo, user_id=user.id, name=f"Alice {i}")
    _create_person(repo, user_id=user.id, name="Bob")
    result = repo.get_many(
        PaginationQueryParams(offset=1, limit=2),
        FilterPeopleQueryParams(name="alice", description=None),
    )
    assert result.total == 5
    assert len(result.items) == 2
    assert result.items[0].name == "Alice 1"


# ---------------------------------------------------------------------------
# get_by_id
# ---------------------------------------------------------------------------


def test_get_by_id_returns_existing_person(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    created = _create_person(repo, user_id=user.id)
    found = repo.get_by_id(created.id)
    assert found.id == created.id
    assert found.name == created.name
    assert found.description == created.description
    assert found.user_id == created.user_id


def test_get_by_id_raises_not_found_for_missing_id(db_session):
    repo = _make_repo(db_session)
    with pytest.raises(EntityNotFoundError, match="Person with id 999"):
        repo.get_by_id(999)


# ---------------------------------------------------------------------------
# delete
# ---------------------------------------------------------------------------


def test_delete_removes_person(db_session):
    repo = _make_repo(db_session)
    user = _create_user(db_session)
    created = _create_person(repo, user_id=user.id)
    repo.delete(created.id)
    with pytest.raises(EntityNotFoundError):
        repo.get_by_id(created.id)


def test_delete_raises_not_found_for_missing_id(db_session):
    repo = _make_repo(db_session)
    with pytest.raises(EntityNotFoundError, match="Person with id 999"):
        repo.delete(999)
