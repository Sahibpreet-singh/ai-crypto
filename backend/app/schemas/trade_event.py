from pydantic import BaseModel


class TradeEvent(BaseModel):
    exchange: str
    trade_id: int
    symbol: str
    price: float
    quantity: float
    trade_time: int
    is_market_maker: bool