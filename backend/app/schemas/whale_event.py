from pydantic import BaseModel


class WhaleEvent(BaseModel):
    symbol: str
    trade_id: int
    price: float
    quantity: float
    value_usd: float
    trade_time: int
    side: str