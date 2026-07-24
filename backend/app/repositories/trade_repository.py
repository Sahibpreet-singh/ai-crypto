from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.schemas.trade_event import TradeEvent


class TradeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_trade(self, trade: TradeEvent):

        trade_model = Trade(
            trade_id=trade.trade_id,
            symbol=trade.symbol,
            price=trade.price,
            quantity=trade.quantity,
            trade_time=trade.trade_time,
            is_market_maker=trade.is_market_maker,
        )

        self.db.add(trade_model)
        self.db.commit()
        self.db.refresh(trade_model)

        return trade_model