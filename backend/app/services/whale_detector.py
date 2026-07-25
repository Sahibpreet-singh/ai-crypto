from app.schemas.trade_event import TradeEvent
from app.schemas.whale_event import WhaleEvent


class WhaleDetector:

    # Trigger for trades worth at least $1,000,000
    THRESHOLD_USD = 1000000

    def detect(self, trade: TradeEvent):

        value = trade.price * trade.quantity

        if value < self.THRESHOLD_USD:
            return None

        return WhaleEvent(
            symbol=trade.symbol,
            trade_id=trade.trade_id,
            price=trade.price,
            quantity=trade.quantity,
            value_usd=value,
            trade_time=trade.trade_time,
            side="SELL" if trade.is_market_maker else "BUY",
        )