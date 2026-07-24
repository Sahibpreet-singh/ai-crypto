from sqlalchemy.dialects.postgresql import insert

from app.models.trade import Trade
from app.schemas.trade_event import TradeEvent


class TradeRepository:

    def __init__(self, db):
        self.db = db

    def create_trade(self, trade: TradeEvent):

        stmt = (
            insert(Trade)
            .values(
                trade_id=trade.trade_id,
                symbol=trade.symbol,
                price=trade.price,
                quantity=trade.quantity,
                trade_time=trade.trade_time,
                is_market_maker=trade.is_market_maker,
            )
            .on_conflict_do_nothing(
                index_elements=["trade_id"]
            )
        )

        self.db.execute(stmt)
        self.db.commit()