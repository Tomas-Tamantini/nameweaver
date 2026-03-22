from http import HTTPStatus

import pytest


def test_create_person_returns_status_created(client, create_person_payload):
    response = client.post("/people", json=create_person_payload)
    assert response.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize(
    "bad_payload",
    [
        {"name": "Only Name"},
        {"description": "Only Description"},
        {"name": "", "description": "Empty Name"},
        {"name": "Empty Description", "description": ""},
    ],
)
def test_create_person_with_bad_data_returns_unprocessable_entity(
    client, bad_payload
):
    response = client.post("/people", json=bad_payload)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
