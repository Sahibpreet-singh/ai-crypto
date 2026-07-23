from sqlalchemy.orm import Session

from app.models.trade import Trade


class TradeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_trade(self, trade_data: dict):

        trade = Trade(
            trade_id=trade_data["t"],
            symbol=trade_data["s"],
            price=float(trade_data["p"]),
            quantity=float(trade_data["q"]),
            trade_time=trade_data["T"],
            is_market_maker=trade_data["m"],
        )

        self.db.add(trade)
        self.db.commit()

        return trade