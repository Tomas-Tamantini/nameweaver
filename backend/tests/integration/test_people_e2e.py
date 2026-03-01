from http import HTTPStatus


def test_create_and_get_people_list(integration_client, create_person_payload):
    create_response = integration_client.post(
        "/people", json=create_person_payload
    )
    assert create_response.status_code == HTTPStatus.CREATED
    person_id = create_response.json()["id"]

    list_response = integration_client.get(
        "/people", params={"q": create_person_payload["description"]}
    )
    assert list_response.status_code == HTTPStatus.OK
    people_response = list_response.json()
    assert people_response["total"] > 0
    people = people_response["items"]
    assert any(p["id"] == person_id for p in people)
