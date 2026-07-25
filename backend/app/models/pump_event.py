from sqlalchemy import BigInteger, Column, Float, Integer, String

from app.database.base import Base


class PumpEvent(Base):
    __tablename__ = "pump_events"

    id = Column(Integer, primary_key=True, index=True)

    symbol = Column(String, index=True)
    event_type = Column(String)          # "PUMP" | "DUMP"

    price_start = Column(Float)          # price at window start
    price_end = Column(Float)            # price at window end
    change_pct = Column(Float)           # signed percentage change

    window_start_ms = Column(BigInteger) # epoch ms
    window_end_ms = Column(BigInteger)   # epoch ms
