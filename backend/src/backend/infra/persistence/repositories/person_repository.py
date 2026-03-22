from dataclasses import asdict

from backend.domain.models.pagination import (
    PaginatedResponse,
    PaginationQueryParams,
)
from backend.domain.models.person import (
    FilterPeopleQueryParams,
    Person,
    PersonBase,
)
from backend.domain.repositories.person_repository import PersonRepository


class FakePersonRepository(PersonRepository):
    def __init__(self):
        self._people = [
            Person(
                id=1,
                name="Ada Lovelace",
                description="English mathematician and writer, known for her "
                "work on Charles Babbage's early mechanical general-purpose "
                "computer.",
            ),
            Person(
                id=2,
                name="Alan Turing",
                description="English mathematician, computer scientist, "
                "logician, cryptanalyst, philosopher, and theoretical "
                "biologist.",
            ),
            Person(
                id=3,
                name="Grace Hopper",
                description="American computer scientist and United States "
                "Navy rear admiral. She was a pioneer of computer "
                "programming.",
            ),
            Person(
                id=4,
                name="Katherine Johnson",
                description="American mathematician whose calculations of "
                "orbital mechanics were critical to the success of crewed "
                "spaceflights.",
            ),
            Person(
                id=5,
                name="Tim Berners-Lee",
                description="English engineer and computer scientist, best "
                "known as the inventor of the World Wide Web.",
            ),
        ]

    def create(self, person: PersonBase) -> Person:
        next_id = max(p.id for p in self._people) + 1 if self._people else 1
        new_person = Person(id=next_id, **asdict(person))
        self._people.append(new_person)
        return new_person

    def get_many(
        self,
        pagination: PaginationQueryParams,
        filter: FilterPeopleQueryParams,
    ) -> PaginatedResponse[Person]:
        filtered_people = self._people
        if filter.name:
            name_lower = filter.name.lower()
            filtered_people = [
                person
                for person in filtered_people
                if name_lower in person.name.lower()
            ]
        if filter.description:
            desc_lower = filter.description.lower()
            filtered_people = [
                person
                for person in filtered_people
                if desc_lower in person.description.lower()
            ]

        start = pagination.offset
        end = pagination.offset + pagination.limit
        paginated_people = filtered_people[start:end]
        return PaginatedResponse(
            total=len(filtered_people), items=paginated_people
        )
