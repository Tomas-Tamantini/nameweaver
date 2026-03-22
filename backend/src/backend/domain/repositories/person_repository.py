from dataclasses import dataclass
from typing import Optional, Protocol

from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import Person, PersonBase


@dataclass(frozen=True)
class FilterPeopleQueryParams:
    name: Optional[str]
    description: Optional[str]


class PersonRepository(Protocol):
    def create(self, person: PersonBase) -> Person: ...

    def get_many(
        self,
        pagination: PaginationQueryParams,
        filter: FilterPeopleQueryParams,
    ) -> PaginatedResponse[Person]: ...
