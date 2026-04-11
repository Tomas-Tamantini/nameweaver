from http import HTTPStatus

import pytest
from pwdlib import PasswordHash

from backend.domain.exceptions import EntityAlreadyExistsError
from backend.domain.models.user import UserBase


def test_create_user_returns_status_created(client, create_user_payload):
    response = client.post("/users", json=create_user_payload)
    assert response.status_code == HTTPStatus.CREATED


def test_create_user_with_bad_data_returns_unprocessable_entity(client):
    response = client.post(
        "/users",
        json={"username": "alice", "email": "alice@example.com"},
    )
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.parametrize(
    "bad_payload",
    [
        {
            "username": "",
            "email": "alice@example.com",
            "password": "super-secret-password",
        },
        {
            "username": "a" * 101,
            "email": "alice@example.com",
            "password": "super-secret-password",
        },
        {
            "username": "alice",
            "email": "ab",
            "password": "super-secret-password",
        },
        {
            "username": "alice",
            "email": "a" * 255,
            "password": "super-secret-password",
        },
        {
            "username": "alice",
            "email": "alice@example.com",
            "password": "12345",
        },
        {
            "username": "alice",
            "email": "alice@example.com",
            "password": "a" * 129,
        },
    ],
)
def test_create_user_with_invalid_field_lengths_returns_unprocessable_entity(
    client, bad_payload
):
    response = client.post("/users", json=bad_payload)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.parametrize(
    "invalid_email",
    [
        "not-an-email",
        "missing-at-sign.com",
        "@no-local-part.com",
        "spaces in@email.com",
    ],
)
def test_create_user_with_invalid_email_format_returns_unprocessable_entity(
    client, invalid_email
):
    response = client.post(
        "/users",
        json={
            "username": "alice",
            "email": invalid_email,
            "password": "super-secret-password",
        },
    )
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_create_user_delegates_to_repository_with_hashed_password(
    client, mock_user_repository, create_user_payload
):
    client.post("/users", json=create_user_payload)

    called_with: UserBase = mock_user_repository.create.call_args.args[0]
    assert called_with.username == create_user_payload["username"]
    assert called_with.email == create_user_payload["email"]
    assert called_with.hashed_password != create_user_payload["password"]
    assert PasswordHash.recommended().verify(
        create_user_payload["password"], called_with.hashed_password
    )


def test_create_user_returns_user_without_hashed_password(
    client, mock_user_repository, user
):
    mock_user_repository.create.return_value = user

    response = client.post(
        "/users",
        json={
            "username": user.username,
            "email": user.email,
            "password": "super-secret-password",
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }


def test_create_user_with_duplicate_username_returns_conflict(
    client, mock_user_repository
):
    mock_user_repository.create.side_effect = EntityAlreadyExistsError(
        "User", "username"
    )

    response = client.post(
        "/users",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "super-secret-password",
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert (
        "User with this username already exists" in response.json()["detail"]
    )


def test_create_user_with_duplicate_email_returns_conflict(
    client, mock_user_repository
):
    mock_user_repository.create.side_effect = EntityAlreadyExistsError(
        "User", "email"
    )

    response = client.post(
        "/users",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "super-secret-password",
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert "User with this email already exists" in response.json()["detail"]
