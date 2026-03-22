from dataclasses import dataclass


@dataclass(frozen=True)
class PersonBase:
    name: str
    description: str


@dataclass(frozen=True)
class Person(PersonBase):
    id: int
