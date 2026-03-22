from tests.fixtures.client import client, integration_client
from tests.fixtures.people import create_person_payload, person
from tests.fixtures.repositories import mock_person_repository

__all__ = [
    "client",
    "integration_client",
    "create_person_payload",
    "person",
    "mock_person_repository",
]
