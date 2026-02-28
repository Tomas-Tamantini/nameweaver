from typing import Annotated

from pydantic import BaseModel, Field


class PersonResponse(BaseModel):
    id: int
    name: Annotated[str, Field(min_length=1, max_length=100)]
    description: Annotated[str, Field(min_length=1, max_length=280)]
