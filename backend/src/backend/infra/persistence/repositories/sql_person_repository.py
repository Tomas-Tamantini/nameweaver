from sqlalchemy import func, select
from sqlalchemy.orm import Session

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
from backend.infra.persistence.orm.person import PersonModel


class SqlPersonRepository(PersonRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, person: PersonBase) -> Person:
        model = PersonModel(name=person.name, description=person.description)
        self._session.add(model)
        self._session.flush()
        return model.to_domain()

    def get_many(
        self,
        pagination: PaginationQueryParams,
        filters: FilterPeopleQueryParams,
    ) -> PaginatedResponse[Person]:
        query = select(PersonModel)

        if filters.name:
            query = query.where(PersonModel.name.icontains(filters.name))
        if filters.description:
            query = query.where(
                PersonModel.description.icontains(filters.description)
            )

        total = self._session.scalar(
            select(func.count()).select_from(query.subquery())
        )

        rows = self._session.scalars(
            query.offset(pagination.offset).limit(pagination.limit)
        ).all()

        return PaginatedResponse(
            total=total or 0,
            items=[row.to_domain() for row in rows],
        )
