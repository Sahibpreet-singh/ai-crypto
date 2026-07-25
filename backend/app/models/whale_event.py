from sqlalchemy import Column, Integer, BigInteger, Float, String

from app.database.base import Base


class WhaleEvent(Base):
    __tablename__ = "whale_events"

    id = Column(Integer, primary_key=True, index=True)

    trade_id = Column(BigInteger, unique=True, index=True)
    symbol = Column(String, index=True)

    price = Column(Float)
    quantity = Column(Float)
    value_usd = Column(Float)

    side = Column(String)
    trade_time = Column(BigInteger)