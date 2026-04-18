class EntityNotFoundError(Exception):
    def __init__(self, entity_name: str, entity_id: int):
        self.entity_name = entity_name
        self.entity_id = entity_id
        super().__init__(f"{entity_name} with id {entity_id} was not found")


class EntityAlreadyExistsError(Exception):
    def __init__(self, entity_name: str, field_name: str):
        self.entity_name = entity_name
        self.field_name = field_name
        super().__init__(
            f"{entity_name} with this {field_name} already exists"
        )


class InvalidCredentialsError(Exception):
    def __init__(self) -> None:
        super().__init__("Invalid username/email or password")


class InvalidTokenError(Exception):
    def __init__(self) -> None:
        super().__init__("Invalid or expired token")
