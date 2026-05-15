from http import HTTPStatus

import pytest

from backend.domain.models.person import PersonBase
from backend.infra.persistence.orm.user import UserModel
from backend.infra.persistence.repositories.sql_person_repository import (
    SqlPersonRepository,
)


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


@pytest.mark.integration
def test_get_people_list_hides_other_users_people(
    integration_client, db_session
):
    other_user = UserModel(
        username="other-owner",
        email="other-owner@example.com",
        hashed_password="other-owner-hash",
    )
    db_session.add(other_user)
    db_session.flush()
    repo = SqlPersonRepository(db_session)
    hidden = repo.create(
        PersonBase(
            name="Hidden Person",
            description="Should not be listed",
            user_id=other_user.id,
        )
    )

    list_response = integration_client.get("/people")
    assert list_response.status_code == HTTPStatus.OK
    ids = [item["id"] for item in list_response.json()["items"]]
    assert hidden.id not in ids


@pytest.mark.integration
def test_get_person_by_id_returns_not_found_for_non_owner(
    integration_client, db_session
):
    other_user = UserModel(
        username="other-owner-2",
        email="other-owner-2@example.com",
        hashed_password="other-owner-hash-2",
    )
    db_session.add(other_user)
    db_session.flush()
    repo = SqlPersonRepository(db_session)
    hidden = repo.create(
        PersonBase(
            name="Hidden Person 2",
            description="Should not be readable",
            user_id=other_user.id,
        )
    )

    response = integration_client.get(f"/people/{hidden.id}")
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.integration
def test_delete_person_returns_not_found_for_non_owner(
    integration_client, db_session
):
    other_user = UserModel(
        username="other-owner-3",
        email="other-owner-3@example.com",
        hashed_password="other-owner-hash-3",
    )
    db_session.add(other_user)
    db_session.flush()
    repo = SqlPersonRepository(db_session)
    hidden = repo.create(
        PersonBase(
            name="Hidden Person 3",
            description="Should not be deletable",
            user_id=other_user.id,
        )
    )

    response = integration_client.delete(f"/people/{hidden.id}")
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.integration
def test_update_person(integration_client, create_person_payload):
    created = integration_client.post(
        "/people", json=create_person_payload
    ).json()

    response = integration_client.patch(
        f"/people/{created['id']}", json={"name": "Updated Name"}
    )
    assert response.status_code == HTTPStatus.OK
    body = response.json()
    assert body["name"] == "Updated Name"
    assert body["description"] == create_person_payload["description"]
    assert body["id"] == created["id"]


@pytest.mark.integration
def test_update_person_not_found(integration_client):
    response = integration_client.patch(
        "/people/999999", json={"name": "Ghost"}
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.integration
def test_update_person_returns_not_found_for_non_owner(
    integration_client, db_session
):
    other_user = UserModel(
        username="other-owner-4",
        email="other-owner-4@example.com",
        hashed_password="other-owner-hash-4",
    )
    db_session.add(other_user)
    db_session.flush()
    repo = SqlPersonRepository(db_session)
    hidden = repo.create(
        PersonBase(
            name="Hidden Person 4",
            description="Should not be editable",
            user_id=other_user.id,
        )
    )

    response = integration_client.patch(
        f"/people/{hidden.id}", json={"name": "Hacked"}
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
