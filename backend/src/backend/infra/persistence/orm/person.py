from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column

from backend.domain.models.person import Person
from backend.infra.persistence.orm.base import Base


class PersonModel(Base):
    __tablename__ = "person"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    def to_domain(self) -> Person:
        return Person(id=self.id, name=self.name, description=self.description)
