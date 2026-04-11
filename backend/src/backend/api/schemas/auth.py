from typing import Annotated

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: Annotated[
        str, Field(min_length=1, max_length=100, examples=["alice"])
    ]
    password: Annotated[
        str,
        Field(
            min_length=1, max_length=128, examples=["super-secret-password"]
        ),
    ]


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Annotated[str, Field(examples=["bearer"])] = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
