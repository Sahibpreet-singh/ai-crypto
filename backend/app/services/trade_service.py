from sqlalchemy.orm import Session

from app.models.trade import Trade


def save_trade(db: Session, trade_data: dict):

    trade = Trade(
        trade_id=trade_data["t"],
        symbol=trade_data["s"],
        price=float(trade_data["p"]),
        quantity=float(trade_data["q"]),
        trade_time=trade_data["T"],
        is_market_maker=trade_data["m"],
    )

    db.add(trade)
    db.commit()