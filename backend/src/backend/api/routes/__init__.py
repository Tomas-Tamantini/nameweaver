from backend.api.routes.auth import auth_router
from backend.api.routes.health import health_router
from backend.api.routes.people import people_router
from backend.api.routes.users import users_router

all_routers = [auth_router, health_router, people_router, users_router]
