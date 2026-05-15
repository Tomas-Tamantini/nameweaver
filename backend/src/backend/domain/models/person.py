from dataclasses import dataclass


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
