from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
