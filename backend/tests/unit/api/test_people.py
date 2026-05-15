from http import HTTPStatus

import pytest

from backend.domain.exceptions import EntityNotFoundError
from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
    UpdatePersonData,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _paginated(*people: Person) -> PaginatedResponse[Person]:
    return PaginatedResponse(total=len(people), items=list(people))


_EMPTY = PaginatedResponse(total=0, items=[])


# ---------------------------------------------------------------------------
# POST /people
# ---------------------------------------------------------------------------


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


def test_create_person_delegates_to_service(
    client, mock_person_service, create_person_payload
):
    client.post("/people", json=create_person_payload)
    mock_person_service.create.assert_called_once_with(
        PersonBase(
            name=create_person_payload["name"],
            description=create_person_payload["description"],
            user_id=1,
        )
    )


def test_create_person_returns_person_from_service(
    client, mock_person_service, person
):
    mock_person_service.create.return_value = person
    response = client.post(
        "/people",
        json={"name": person.name, "description": person.description},
    )
    assert response.status_code == HTTPStatus.CREATED
    body = response.json()
    assert body == {
        "id": person.id,
        "name": person.name,
        "description": person.description,
    }


# ---------------------------------------------------------------------------
# GET /people — status and response shape
# ---------------------------------------------------------------------------


def test_get_people_returns_ok(client, mock_person_service):
    mock_person_service.get_many.return_value = _EMPTY
    response = client.get("/people")
    assert response.status_code == HTTPStatus.OK


def test_get_people_response_contains_total_and_items(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    body = client.get("/people").json()
    assert "total" in body
    assert "items" in body


def test_get_people_returns_items_from_service(client, mock_person_service):
    people = [
        Person(
            id=1,
            name="Ada Lovelace",
            description="mathematician",
            user_id=1,
        ),
        Person(
            id=2,
            name="Grace Hopper",
            description="computer scientist",
            user_id=1,
        ),
    ]
    mock_person_service.get_many.return_value = _paginated(*people)
    body = client.get("/people").json()
    assert body["total"] == 2
    assert len(body["items"]) == 2
    assert body["items"][0] == {
        "id": 1,
        "name": "Ada Lovelace",
        "description": "mathematician",
    }
    assert body["items"][1] == {
        "id": 2,
        "name": "Grace Hopper",
        "description": "computer scientist",
    }


# ---------------------------------------------------------------------------
# GET /people — pagination delegation
# ---------------------------------------------------------------------------


def test_get_people_delegates_default_pagination_to_service(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    client.get("/people")
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name=None, description=None, user_id=1
        ),
    )


def test_get_people_delegates_custom_pagination_to_service(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    client.get("/people", params={"offset": 20, "limit": 5})
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=20, limit=5),
        filters=FilterPeopleQueryParams(
            name=None, description=None, user_id=1
        ),
    )


def test_get_people_accepts_max_limit(client, mock_person_service):
    mock_person_service.get_many.return_value = _EMPTY
    response = client.get("/people", params={"limit": 100})
    assert response.status_code == HTTPStatus.OK
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=100),
        filters=FilterPeopleQueryParams(
            name=None, description=None, user_id=1
        ),
    )


# ---------------------------------------------------------------------------
# GET /people — invalid pagination
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "bad_params",
    [
        {"offset": -1},
        {"limit": 0},
        {"limit": 101},
    ],
)
def test_get_people_with_invalid_pagination_returns_unprocessable_entity(
    client, mock_person_service, bad_params
):
    mock_person_service.get_many.return_value = _EMPTY
    response = client.get("/people", params=bad_params)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


# ---------------------------------------------------------------------------
# GET /people — filter delegation
# ---------------------------------------------------------------------------


def test_get_people_delegates_name_filter_to_service(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    client.get("/people", params={"name": "Ada"})
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name="Ada", description=None, user_id=1
        ),
    )


def test_get_people_delegates_description_filter_to_service(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    client.get("/people", params={"description": "mathematician"})
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name=None, description="mathematician", user_id=1
        ),
    )


def test_get_people_delegates_combined_filters_to_service(
    client, mock_person_service
):
    mock_person_service.get_many.return_value = _EMPTY
    client.get(
        "/people", params={"name": "Ada", "description": "mathematician"}
    )
    mock_person_service.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name="Ada", description="mathematician", user_id=1
        ),
    )


# ---------------------------------------------------------------------------
# GET /people/{person_id}
# ---------------------------------------------------------------------------


def test_get_person_returns_ok(client, mock_person_service, person):
    mock_person_service.get_by_id.return_value = person
    response = client.get(f"/people/{person.id}")
    assert response.status_code == HTTPStatus.OK


def test_get_person_returns_person_from_service(
    client, mock_person_service, person
):
    mock_person_service.get_by_id.return_value = person
    body = client.get(f"/people/{person.id}").json()
    assert body == {
        "id": person.id,
        "name": person.name,
        "description": person.description,
    }


def test_get_person_delegates_to_service(client, mock_person_service, person):
    mock_person_service.get_by_id.return_value = person
    client.get(f"/people/{person.id}")
    mock_person_service.get_by_id.assert_called_once_with(
        user_id=1,
        person_id=person.id,
    )


def test_get_person_not_found_returns_404(client, mock_person_service):
    mock_person_service.get_by_id.side_effect = EntityNotFoundError(
        "Person", 999
    )
    response = client.get("/people/999")
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert "Person with id 999 was not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# DELETE /people/{person_id}
# ---------------------------------------------------------------------------


def test_delete_person_returns_no_content(client, person):
    response = client.delete(f"/people/{person.id}")
    assert response.status_code == HTTPStatus.NO_CONTENT


def test_delete_person_delegates_to_repository(
    client, mock_person_service, person
):
    client.delete(f"/people/{person.id}")
    mock_person_service.delete.assert_called_once_with(
        user_id=1,
        person_id=person.id,
    )


def test_delete_person_not_found_returns_404(client, mock_person_service):
    mock_person_service.delete.side_effect = EntityNotFoundError("Person", 999)
    response = client.delete("/people/999")
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert "Person with id 999 was not found" in response.json()["detail"]


def test_delete_person_returns_empty_body(client, person):
    response = client.delete(f"/people/{person.id}")
    assert response.content == b""


# ---------------------------------------------------------------------------
# PATCH /people/{person_id}
# ---------------------------------------------------------------------------


def test_update_person_returns_ok(client, mock_person_service, person):
    mock_person_service.update.return_value = person
    response = client.patch(f"/people/{person.id}", json={"name": "New Name"})
    assert response.status_code == HTTPStatus.OK


def test_update_person_returns_updated_person_from_service(
    client, mock_person_service, person
):
    updated = Person(
        id=person.id,
        name="New Name",
        description=person.description,
        user_id=person.user_id,
    )
    mock_person_service.update.return_value = updated
    response = client.patch(f"/people/{person.id}", json={"name": "New Name"})
    body = response.json()
    assert body["name"] == "New Name"
    assert body["id"] == person.id


def test_update_person_delegates_to_service(
    client, mock_person_service, person
):

    mock_person_service.update.return_value = person
    client.patch(f"/people/{person.id}", json={"name": "Changed"})
    mock_person_service.update.assert_called_once_with(
        user_id=1,
        person_id=person.id,
        data=UpdatePersonData(name="Changed", description=None),
    )


def test_update_person_not_found_returns_404(
    client, mock_person_service, person
):
    mock_person_service.update.side_effect = EntityNotFoundError(
        "Person", person.id
    )
    response = client.patch(f"/people/{person.id}", json={"name": "New"})
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.parametrize(
    "bad_payload",
    [
        {"name": ""},
        {"description": ""},
        {"name": "", "description": ""},
    ],
)
def test_update_person_with_empty_fields_returns_unprocessable_entity(
    client, bad_payload
):
    response = client.patch("/people/1", json=bad_payload)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.parametrize(
    ("method", "url"),
    [
        ("POST", "/people"),
        ("GET", "/people"),
        ("GET", "/people/1"),
        ("PATCH", "/people/1"),
        ("DELETE", "/people/1"),
    ],
)
def test_unauthenticated_request_returns_401(
    unauthenticated_client, method, url
):
    response = unauthenticated_client.request(method, url)
    assert response.status_code == HTTPStatus.UNAUTHORIZED
