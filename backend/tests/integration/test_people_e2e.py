from http import HTTPStatus

import pytest


@pytest.mark.integration
def test_create_and_get_people_list(integration_client, create_person_payload):
    create_response = integration_client.post(
        "/people", json=create_person_payload
    )
    assert create_response.status_code == HTTPStatus.CREATED
    person_id = create_response.json()["id"]

    list_response = integration_client.get(
        "/people",
        params={"description": create_person_payload["description"]},
    )
    assert list_response.status_code == HTTPStatus.OK
    people_response = list_response.json()
    assert people_response["total"] > 0
    people = people_response["items"]
    assert any(p["id"] == person_id for p in people)


@pytest.mark.integration
def test_get_person_by_id(integration_client, create_person_payload):
    created = integration_client.post(
        "/people", json=create_person_payload
    ).json()

    response = integration_client.get(f"/people/{created['id']}")
    assert response.status_code == HTTPStatus.OK
    assert response.json()["id"] == created["id"]
    assert response.json()["name"] == create_person_payload["name"]


@pytest.mark.integration
def test_get_person_not_found(integration_client):
    response = integration_client.get("/people/999999")
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.integration
def test_delete_person(integration_client, create_person_payload):
    created = integration_client.post(
        "/people", json=create_person_payload
    ).json()

    delete_response = integration_client.delete(f"/people/{created['id']}")
    assert delete_response.status_code == HTTPStatus.NO_CONTENT

    get_response = integration_client.get(f"/people/{created['id']}")
    assert get_response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.integration
def test_delete_person_not_found(integration_client):
    response = integration_client.delete("/people/999999")
    assert response.status_code == HTTPStatus.NOT_FOUND
