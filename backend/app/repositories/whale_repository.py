from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.whale_event import WhaleEvent


class WhaleRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, whale):
        stmt = (
            insert(WhaleEvent)
            .values(
                trade_id=whale.trade_id,
                symbol=whale.symbol,
                price=whale.price,
                quantity=whale.quantity,
                value_usd=whale.value_usd,
                side=whale.side,
                trade_time=whale.trade_time,
            )
            .on_conflict_do_nothing(index_elements=["trade_id"])
        )
        self.db.execute(stmt)
        self.db.commit()

    def get_latest(self, symbol: str, limit: int = 100):
        return (
            self.db.query(WhaleEvent)
            .filter(WhaleEvent.symbol == symbol)
            .order_by(WhaleEvent.trade_time.desc())
            .limit(limit)
            .all()
        )
