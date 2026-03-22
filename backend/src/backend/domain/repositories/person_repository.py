from typing import Protocol

from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
)


class PersonRepository(Protocol):
    def create(self, person: PersonBase) -> Person: ...

    def get_many(
        self,
        pagination: PaginationQueryParams,
        filters: FilterPeopleQueryParams,
    ) -> PaginatedResponse[Person]: ...
