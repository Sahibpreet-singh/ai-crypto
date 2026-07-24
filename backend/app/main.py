from fastapi import FastAPI

from app.api.market import router as market_router

app = FastAPI(
    title="Crypto Intelligence Platform",
)

app.include_router(market_router)


@app.get("/")
async def root():
    return {
        "project": "Crypto Intelligence Platform",
        "status": "Running",
    }   