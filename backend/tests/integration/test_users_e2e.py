from http import HTTPStatus

import pytest


@pytest.mark.integration
def test_create_user_returns_created_user(
    integration_client, create_user_payload
):
    response = integration_client.post("/users", json=create_user_payload)
    assert response.status_code == HTTPStatus.CREATED
    body = response.json()
    assert "id" in body
    assert body["username"] == create_user_payload["username"]
    assert body["email"] == create_user_payload["email"]
    assert "hashed_password" not in body
    assert "password" not in body


@pytest.mark.integration
def test_create_user_with_duplicate_username_returns_conflict(
    integration_client,
):
    payload = {
        "username": "alice",
        "email": "alice@example.com",
        "password": "super-secret-password",
    }
    integration_client.post("/users", json=payload)

    conflict = integration_client.post(
        "/users",
        json={
            "username": "alice",
            "email": "another@example.com",
            "password": "super-secret-password",
        },
    )
    assert conflict.status_code == HTTPStatus.CONFLICT
