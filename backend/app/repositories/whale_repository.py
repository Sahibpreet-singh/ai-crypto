from sqlalchemy.dialects.postgresql import insert

from app.models.whale_event import WhaleEvent


class WhaleRepository:

    def __init__(self, db):
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
            .on_conflict_do_nothing(
                index_elements=["trade_id"]
            )
        )

        self.db.execute(stmt)
        self.db.commit()