from sqlalchemy.orm import Session


from app.repositories.trade_repository import TradeRepository
from app.repositories.whale_repository import WhaleRepository
from app.services.whale_detector import WhaleDetector


class TradeProcessor:

    def __init__(self, db: Session):
        self.trade_repository = TradeRepository(db)
        self.whale_repository = WhaleRepository(db)
        self.whale_detector = WhaleDetector()

    def process_trade(self, trade_event: dict):

        

        # Save trade
        self.trade_repository.create_trade(trade_event)

        # Cache latest trade
        # TODO

        # Whale Detection
        whale = self.whale_detector.detect(trade_event)

        if whale:
            self.whale_repository.create(whale)

            print("\n🐋 WHALE DETECTED")
            print(f"Symbol   : {whale.symbol}")
            print(f"Value    : ${whale.value_usd:,.2f}")
            print(f"Side     : {whale.side}")
            print("-" * 40)

        # Pump Detection
        # TODO

        # WebSocket
        # TODO

        # AI Pipeline
        # TODO