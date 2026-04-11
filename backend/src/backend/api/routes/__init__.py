from backend.api.routes.health import health_router
from backend.api.routes.people import people_router
from backend.api.routes.users import users_router

all_routers = [health_router, people_router, users_router]
