from typing import Protocol

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


class PersonRepository(Protocol):
    def create(self, person: PersonBase) -> Person: ...

    def get_by_id(self, person_id: int) -> Person: ...

    def update(self, person_id: int, data: UpdatePersonData) -> Person: ...

    def delete(self, person_id: int) -> None: ...

    def get_many(
        self,
        pagination: PaginationQueryParams,
        filters: FilterPeopleQueryParams,
        sort: SortPeopleQueryParams,
    ) -> PaginatedResponse[Person]: ...
