from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.cache.redis_service import RedisService
from app.database.database import SessionLocal
from app.services.market_service import MarketService

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)

redis_service = RedisService()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/latest/{symbol}")
def latest_trade(symbol: str):

    trade = redis_service.get_latest_trade(symbol.upper())

    if trade is None:
        raise HTTPException(status_code=404, detail="No trade found.")

    return trade


@router.get("/trades/{symbol}")
def latest_trades(
    symbol: str,
    limit: int = 100,
    db: Session = Depends(get_db),
):

    service = MarketService(db)

    return service.get_latest_trades(symbol.upper(), limit)