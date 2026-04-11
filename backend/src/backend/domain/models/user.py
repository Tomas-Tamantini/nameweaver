from dataclasses import dataclass


@dataclass(frozen=True)
class UserBase:
    username: str
    email: str
    hashed_password: str


@dataclass(frozen=True)
class User(UserBase):
    id: int
