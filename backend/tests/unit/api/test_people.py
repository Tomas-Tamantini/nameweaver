from http import HTTPStatus

import pytest

from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
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


def test_create_person_delegates_to_repository(
    client, mock_person_repository, create_person_payload
):
    client.post("/people", json=create_person_payload)
    mock_person_repository.create.assert_called_once_with(
        PersonBase(
            name=create_person_payload["name"],
            description=create_person_payload["description"],
        )
    )


def test_create_person_returns_person_from_repository(
    client, mock_person_repository, person
):
    mock_person_repository.create.return_value = person
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


def test_get_people_returns_ok(client, mock_person_repository):
    mock_person_repository.get_many.return_value = _EMPTY
    response = client.get("/people")
    assert response.status_code == HTTPStatus.OK


def test_get_people_response_contains_total_and_items(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    body = client.get("/people").json()
    assert "total" in body
    assert "items" in body


def test_get_people_returns_items_from_repository(
    client, mock_person_repository
):
    people = [
        Person(id=1, name="Ada Lovelace", description="mathematician"),
        Person(id=2, name="Grace Hopper", description="computer scientist"),
    ]
    mock_person_repository.get_many.return_value = _paginated(*people)
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


def test_get_people_delegates_default_pagination_to_repository(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    client.get("/people")
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(name=None, description=None),
    )


def test_get_people_delegates_custom_pagination_to_repository(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    client.get("/people", params={"offset": 20, "limit": 5})
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=20, limit=5),
        filters=FilterPeopleQueryParams(name=None, description=None),
    )


def test_get_people_accepts_max_limit(client, mock_person_repository):
    mock_person_repository.get_many.return_value = _EMPTY
    response = client.get("/people", params={"limit": 100})
    assert response.status_code == HTTPStatus.OK
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=100),
        filters=FilterPeopleQueryParams(name=None, description=None),
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
    client, mock_person_repository, bad_params
):
    mock_person_repository.get_many.return_value = _EMPTY
    response = client.get("/people", params=bad_params)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


# ---------------------------------------------------------------------------
# GET /people — filter delegation
# ---------------------------------------------------------------------------


def test_get_people_delegates_name_filter_to_repository(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    client.get("/people", params={"name": "Ada"})
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(name="Ada", description=None),
    )


def test_get_people_delegates_description_filter_to_repository(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    client.get("/people", params={"description": "mathematician"})
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name=None, description="mathematician"
        ),
    )


def test_get_people_delegates_combined_filters_to_repository(
    client, mock_person_repository
):
    mock_person_repository.get_many.return_value = _EMPTY
    client.get(
        "/people", params={"name": "Ada", "description": "mathematician"}
    )
    mock_person_repository.get_many.assert_called_once_with(
        pagination=PaginationQueryParams(offset=0, limit=10),
        filters=FilterPeopleQueryParams(
            name="Ada", description="mathematician"
        ),
    )
