from sqlalchemy.orm import Session

from app.cache.redis_service import RedisService
from app.repositories.trade_repository import TradeRepository
from app.schemas.trade_event import TradeEvent


class TradeProcessor:

    def __init__(self, db: Session):
        self.repository = TradeRepository(db)
        self.redis = RedisService()

    def process_trade(self, trade: TradeEvent):

        # Save in PostgreSQL
        self.repository.create_trade(trade)

        # Cache latest trade
        self.redis.cache_latest_trade(trade)
        self.redis.cache_latest_price(trade)

        # TODO
        # Whale Detection

        # TODO
        # Pump Detection

        # TODO
        # Broadcast

        # TODO
        # AI