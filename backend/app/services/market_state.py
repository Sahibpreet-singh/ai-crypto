from app.cache.redis_service import RedisService
from app.schemas.trade_event import TradeEvent


class MarketState:

    def __init__(self):
        self.redis = RedisService()

    def update(self, trade: TradeEvent):
        self.market_state.update(trade)
        

    def get_latest_trade(self, symbol: str):
        return self.redis.get_latest_trade(symbol)