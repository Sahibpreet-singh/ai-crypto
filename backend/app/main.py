from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {
        "project": "Crypto Intelligence Platform",
        "status": "Running"
    }