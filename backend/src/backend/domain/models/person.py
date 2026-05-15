from dataclasses import dataclass
from enum import StrEnum


class PersonSortField(StrEnum):
    ID = "id"
    NAME = "name"


class SortOrder(StrEnum):
    ASC = "asc"
    DESC = "desc"


@dataclass(frozen=True)
class PersonBase:
    name: str
    description: str
    user_id: int


@dataclass(frozen=True)
class Person(PersonBase):
    id: int


@dataclass(frozen=True)
class UpdatePersonData:
    name: str | None
    description: str | None


@dataclass(frozen=True)
class FilterPeopleQueryParams:
    name: str | None
    description: str | None
    user_id: int | None


@dataclass(frozen=True)
class SortPeopleQueryParams:
    sort_by: PersonSortField = PersonSortField.ID
    sort_order: SortOrder = SortOrder.ASC
