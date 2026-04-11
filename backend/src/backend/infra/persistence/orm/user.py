from datetime import datetime

from sqlalchemy import UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.domain.models.user import User
from backend.infra.persistence.orm.base import Base


class UserModel(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("username", name="uq_users_username"),
        UniqueConstraint("email", name="uq_users_email"),
    )

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    username: Mapped[str]
    email: Mapped[str]
    hashed_password: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    def to_domain(self) -> User:
        return User(
            id=self.id,
            username=self.username,
            email=self.email,
            hashed_password=self.hashed_password,
        )
