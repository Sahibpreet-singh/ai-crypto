from sqlalchemy.orm import Session

from app.repositories.market_repository import MarketRepository


class MarketService:

    def __init__(self, db: Session):
        self.repo = MarketRepository(db)

    def get_latest_trades(self, symbol: str, limit: int):

        return self.repo.get_latest_trades(symbol, limit)