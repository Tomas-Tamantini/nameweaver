from typing import Generic, Sequence, TypeVar

from pydantic import BaseModel, NonNegativeInt

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    items: Sequence[T]


class PaginationQueryParams(BaseModel):
    offset: NonNegativeInt = 0
    limit: NonNegativeInt = 10
