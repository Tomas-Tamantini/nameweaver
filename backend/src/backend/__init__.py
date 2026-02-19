from fastapi import FastAPI
import uvicorn


app = FastAPI()


@app.get("/hello")
def hello() -> dict[str, str]:
    return {"message": "Hello, world!"}


def main() -> None:
    uvicorn.run("backend:app", host="127.0.0.1", port=8000, reload=True)
