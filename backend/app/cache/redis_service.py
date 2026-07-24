import json

from app.cache.redis_client import redis
from app.schemas.trade_event import TradeEvent


class RedisService:

    def cache_latest_trade(self, trade: TradeEvent):

        redis.set(
            f"latest_trade:{trade.symbol}",
            trade.model_dump_json(),
        )

    def cache_latest_price(self, trade: TradeEvent):

        redis.set(
            f"latest_price:{trade.symbol}",
            trade.price,
        )

    def get_latest_trade(self, symbol: str):

        data = redis.get(f"latest_trade:{symbol}")

        if not data:
            return None

        return TradeEvent.model_validate_json(data)