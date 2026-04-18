from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.domain.exceptions import EntityAlreadyExistsError
from backend.domain.models.user import User, UserBase
from backend.domain.repositories.user_repository import UserRepository
from backend.infra.persistence.orm.user import UserModel


class SqlUserRepository(UserRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, user: UserBase) -> User:
        model = UserModel(
            username=user.username,
            email=user.email,
            hashed_password=user.hashed_password,
        )
        self._session.add(model)
        try:
            self._session.flush()
        except IntegrityError as exc:
            self._session.rollback()
            details = str(exc.orig)
            if "uq_users_username" in details:
                raise EntityAlreadyExistsError("User", "username") from exc
            if "uq_users_email" in details:
                raise EntityAlreadyExistsError("User", "email") from exc
            raise
        return model.to_domain()

    def get_by_username(self, username: str) -> User | None:
        model = (
            self._session
            .query(UserModel)
            .filter(UserModel.username == username)
            .first()
        )
        return model.to_domain() if model else None

    def get_by_email(self, email: str) -> User | None:
        model = (
            self._session
            .query(UserModel)
            .filter(UserModel.email == email)
            .first()
        )
        return model.to_domain() if model else None
