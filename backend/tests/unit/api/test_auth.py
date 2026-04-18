from http import HTTPStatus

from backend.domain.exceptions import InvalidCredentialsError


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
