from backend.domain.exceptions import EntityNotFoundError
from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
    SortPeopleQueryParams,
    UpdatePersonData,
)
from backend.domain.repositories.person_repository import PersonRepository


class PersonService:
    def __init__(self, person_repo: PersonRepository) -> None:
        self._person_repo = person_repo

    def create(self, person: PersonBase) -> Person:
        return self._person_repo.create(person)

    def get_many(
        self,
        *,
        pagination: PaginationQueryParams,
        filters: FilterPeopleQueryParams,
        sort: SortPeopleQueryParams,
    ) -> PaginatedResponse[Person]:
        return self._person_repo.get_many(
            pagination=pagination,
            filters=filters,
            sort=sort,
        )

    def get_by_id(self, *, user_id: int, person_id: int) -> Person:
        person = self._person_repo.get_by_id(person_id=person_id)
        if person.user_id != user_id:
            raise EntityNotFoundError("Person", person_id)
        return person

    def update(
        self, *, user_id: int, person_id: int, data: UpdatePersonData
    ) -> Person:
        _ = self.get_by_id(user_id=user_id, person_id=person_id)
        return self._person_repo.update(person_id=person_id, data=data)

    def delete(self, *, user_id: int, person_id: int) -> None:
        _ = self.get_by_id(user_id=user_id, person_id=person_id)
        self._person_repo.delete(person_id=person_id)
