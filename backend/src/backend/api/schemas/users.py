from typing import Annotated

from pydantic import BaseModel, EmailStr, Field

from backend.domain.models.user import User


class CreateUserRequest(BaseModel):
    username: Annotated[
        str, Field(min_length=1, max_length=100, examples=["alice"])
    ]
    email: Annotated[
        EmailStr,
        Field(max_length=254, examples=["alice@example.com"]),
    ]
    password: Annotated[
        str,
        Field(
            min_length=6, max_length=128, examples=["super-secret-password"]
        ),
    ]


class UserResponse(BaseModel):
    id: int
    username: Annotated[
        str, Field(min_length=1, max_length=100, examples=["alice"])
    ]
    email: Annotated[
        str,
        Field(min_length=3, max_length=254, examples=["alice@example.com"]),
    ]

    @staticmethod
    def from_domain(user: User) -> "UserResponse":
        return UserResponse(
            id=user.id, username=user.username, email=user.email
        )
