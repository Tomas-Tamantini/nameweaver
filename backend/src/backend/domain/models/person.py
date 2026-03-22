from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class PersonBase:
    name: str
    description: str


@dataclass(frozen=True)
class Person(PersonBase):
    id: int


@dataclass(frozen=True)
class FilterPeopleQueryParams:
    name: Optional[str]
    description: Optional[str]
