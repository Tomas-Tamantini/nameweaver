import pytest

from backend.domain.models.user import User, UserBase


@pytest.fixture
def user_base():
    return UserBase(
        username="alice",
        email="alice@example.com",
        hashed_password="$argon2id$v=19$m=65536,t=3,p=4$stub$stub",
    )


@pytest.fixture
def user(user_base):
    return User(id=1, **user_base.__dict__)


@pytest.fixture
def create_user_payload():
    return {
        "username": "alice",
        "email": "alice@example.com",
        "password": "super-secret-password",
    }
