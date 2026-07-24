from fastapi import APIRouter, HTTPException

from app.cache.redis_service import RedisService

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)

redis_service = RedisService()


@router.get("/latest/{symbol}")
def latest_trade(symbol: str):

    trade = redis_service.get_latest_trade(symbol.upper())

    if trade is None:
        raise HTTPException(
            status_code=404,
            detail="No trade found.",
        )

    return trade