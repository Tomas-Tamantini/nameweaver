from dataclasses import dataclass
from typing import Generic, Sequence, TypeVar

T = TypeVar("T")


@dataclass(frozen=True)
class PaginatedResponse(Generic[T]):
    total: int
    items: Sequence[T]


@dataclass(frozen=True)
class PaginationQueryParams:
    offset: int = 0
    limit: int = 10
