from backend.api.routes.health import health_router
from backend.api.routes.people import people_router

all_routers = [health_router, people_router]
