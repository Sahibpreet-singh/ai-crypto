from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.market import router as market_router
from app.api.analytics import router as analytics_router

app = FastAPI(
    title="Crypto Intelligence Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {
        "project": "Crypto Intelligence Platform",
        "status": "running",
    }
