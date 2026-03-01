def test_create_and_get_people_list(integration_client):
    create_response = integration_client.post(
        "/people", json={"name": "Alice", "description": "A test person"}
    )
    assert create_response.status_code == 201
    person_id = create_response.json()["id"]

    list_response = integration_client.get(
        "/people", params={"q": "A test person"}
    )
    assert list_response.status_code == 200
    people_response = list_response.json()
    assert people_response["total"] > 0
    people = people_response["items"]
    assert any(p["id"] == person_id for p in people)
