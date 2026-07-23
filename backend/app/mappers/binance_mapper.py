from app.schemas.trade_event import TradeEvent


def map_trade(data: dict) -> TradeEvent:
    return TradeEvent(
        exchange="binance",
        trade_id=data["t"],
        symbol=data["s"],
        price=float(data["p"]),
        quantity=float(data["q"]),
        trade_time=data["T"],
        is_market_maker=data["m"],
    )