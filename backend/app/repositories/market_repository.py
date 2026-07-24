from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.trade import Trade


class MarketRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_latest_trades(self, symbol: str, limit: int = 100):

        return (
            self.db.query(Trade)
            .filter(Trade.symbol == symbol)
            .order_by(desc(Trade.trade_time))
            .limit(limit)
            .all()
        )