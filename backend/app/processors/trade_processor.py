from sqlalchemy.orm import Session

from app.services.trade_service import save_trade


class TradeProcessor:

    def __init__(self, db: Session):
        self.db = db

    def process_trade(self, trade: dict):

        # 1. Save trade
        save_trade(self.db, trade)

        # 2. Update Redis
        # TODO

        # 3. Whale Detection
        # TODO

        # 4. Pump Detection
        # TODO

        # 5. Broadcast to WebSocket clients
        # TODO

        # 6. AI Pipeline
        # TODO