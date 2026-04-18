from http import HTTPStatus

from fastapi import APIRouter

from backend.api.dependencies.repositories import T_UserRepository
from backend.api.dependencies.services import T_PasswordHasher
from backend.api.schemas.users import CreateUserRequest, UserResponse
from backend.domain.models.user import UserBase

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("/", status_code=HTTPStatus.CREATED)
def create_user(
    body: CreateUserRequest,
    repo: T_UserRepository,
    password_hasher: T_PasswordHasher,
) -> UserResponse:
    parsed = UserBase(
        username=body.username,
        email=body.email,
        hashed_password=password_hasher.hash(body.password),
    )
    new_user = repo.create(parsed)
    return UserResponse.from_domain(new_user)
