import pytest

from backend.domain.exceptions import EntityAlreadyExistsError
from backend.domain.models.user import UserBase
from backend.infra.persistence.repositories.sql_user_repository import (
    SqlUserRepository,
)

pytestmark = pytest.mark.integration


def _make_repo(db_session):
    return SqlUserRepository(db_session)


def _create_user(
    repo,
    username="alice",
    email="alice@example.com",
    hashed_password="hashed-password",
):
    return repo.create(
        UserBase(
            username=username,
            email=email,
            hashed_password=hashed_password,
        )
    )


def test_create_returns_user_with_generated_id(db_session):
    repo = _make_repo(db_session)
    user = _create_user(repo)
    assert user.id is not None
    assert user.username == "alice"
    assert user.email == "alice@example.com"
    assert user.hashed_password == "hashed-password"


def test_create_raises_if_username_already_exists(db_session):
    repo = _make_repo(db_session)
    _create_user(repo, username="alice", email="alice@example.com")

    with pytest.raises(
        EntityAlreadyExistsError,
        match="User with this username already exists",
    ):
        _create_user(repo, username="alice", email="another@example.com")


def test_create_raises_if_email_already_exists(db_session):
    repo = _make_repo(db_session)
    _create_user(repo, username="alice", email="alice@example.com")

    with pytest.raises(
        EntityAlreadyExistsError,
        match="User with this email already exists",
    ):
        _create_user(repo, username="another", email="alice@example.com")


def test_get_by_username_returns_user_if_exists(db_session):
    repo = _make_repo(db_session)
    _create_user(repo, username="alice", email="alice@example.com")

    user = repo.get_by_username("alice")
    assert user is not None
    assert user.username == "alice"
    assert user.email == "alice@example.com"
    assert user.hashed_password == "hashed-password"


def test_get_by_username_returns_none_if_not_exists(db_session):
    repo = _make_repo(db_session)
    user = repo.get_by_username("nonexistent")
    assert user is None
