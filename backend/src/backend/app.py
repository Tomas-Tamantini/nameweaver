from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import all_routers
from backend.settings import settings

app = FastAPI()
allow_origins = list(map(str.strip, settings.ALLOWED_ORIGINS.split(",")))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


for router in all_routers:
    app.include_router(router)
