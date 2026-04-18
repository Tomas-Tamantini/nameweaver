from typing import Annotated

from fastapi import Depends
from pwdlib import PasswordHash

from backend.domain.security.password_hasher import PasswordHasher


def get_password_hasher() -> PasswordHasher:
    return PasswordHash.recommended()


T_PasswordHasher = Annotated[PasswordHasher, Depends(get_password_hasher)]
