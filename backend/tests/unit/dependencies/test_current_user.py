import pytest

from backend.api.dependencies.services import get_current_user_id
from backend.domain.exceptions import InvalidTokenError


def test_returns_user_id_from_auth_service(mock_auth_service):
    mock_auth_service.get_user_id_from_access_token.return_value = 42

    result = get_current_user_id(
        token="some-token", auth_service=mock_auth_service
    )

    assert result == 42


def test_delegates_to_auth_service(mock_auth_service):
    mock_auth_service.get_user_id_from_access_token.return_value = 1

    get_current_user_id(
        token="my-access-token", auth_service=mock_auth_service
    )

    mock_auth_service.get_user_id_from_access_token.assert_called_once_with(
        "my-access-token"
    )


def test_propagates_invalid_token_error(mock_auth_service):
    mock_auth_service.get_user_id_from_access_token.side_effect = (
        InvalidTokenError()
    )

    with pytest.raises(InvalidTokenError):
        get_current_user_id(token="bad-tok", auth_service=mock_auth_service)
