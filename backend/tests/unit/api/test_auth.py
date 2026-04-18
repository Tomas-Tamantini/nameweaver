from http import HTTPStatus

from backend.domain.exceptions import (
    InvalidCredentialsError,
    InvalidTokenError,
)


def test_login_returns_ok(client):
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "super-secret-password"},
    )
    assert response.status_code == HTTPStatus.OK


def test_login_returns_token_response(client):
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "super-secret-password"},
    )
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"


def test_login_returns_tokens_from_auth_service(client):
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "super-secret-password"},
    )
    body = response.json()
    assert body["access_token"] == "test-access-token"
    assert body["refresh_token"] == "test-refresh-token"


def test_login_delegates_to_auth_service(client, mock_auth_service):
    client.post(
        "/auth/login",
        data={"username": "alice", "password": "super-secret-password"},
    )
    mock_auth_service.login.assert_called_once_with(
        username_or_email="alice", password="super-secret-password"
    )


def test_login_invalid_credentials_returns_401(client, mock_auth_service):
    mock_auth_service.login.side_effect = InvalidCredentialsError()
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "wrong-password"},
    )
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert "Invalid" in response.json()["detail"]


# --- refresh endpoint tests ---


def test_refresh_returns_ok(client):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "some-refresh-token"},
    )
    assert response.status_code == HTTPStatus.OK


def test_refresh_returns_token_response(client):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "some-refresh-token"},
    )
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"


def test_refresh_returns_tokens_from_auth_service(client):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "some-refresh-token"},
    )
    body = response.json()
    assert body["access_token"] == "new-access-token"
    assert body["refresh_token"] == "original-refresh-token"


def test_refresh_delegates_to_auth_service(client, mock_auth_service):
    client.post(
        "/auth/refresh",
        json={"refresh_token": "the-refresh-token"},
    )
    mock_auth_service.refresh.assert_called_once_with(
        refresh_token="the-refresh-token",
    )


def test_refresh_invalid_token_returns_401(client, mock_auth_service):
    mock_auth_service.refresh.side_effect = InvalidTokenError()
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "bad-token"},
    )
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert "Invalid" in response.json()["detail"]


def test_refresh_deleted_user_returns_401(client, mock_auth_service):
    mock_auth_service.refresh.side_effect = InvalidCredentialsError()
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "some-token"},
    )
    assert response.status_code == HTTPStatus.UNAUTHORIZED
