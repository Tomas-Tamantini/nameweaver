from typing import Annotated

from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Annotated[str, Field(examples=["bearer"])] = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
