from fastapi import APIRouter

router = APIRouter(prefix="/market", tags=["Market"])


@router.get("/latest/{symbol}")
def latest(symbol: str):
    ...