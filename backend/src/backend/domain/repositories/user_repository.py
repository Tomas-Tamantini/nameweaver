from typing import Protocol

from backend.domain.models.user import User, UserBase


class UserRepository(Protocol):
    def create(self, user: UserBase) -> User: ...
