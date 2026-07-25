from sqlalchemy import BigInteger, Column, Float, Integer, String

from app.database.base import Base


class VolumeSpike(Base):
    __tablename__ = "volume_spikes"

    id = Column(Integer, primary_key=True, index=True)

    symbol = Column(String, index=True)
    current_volume = Column(Float)    # volume in the spike window
    average_volume = Column(Float)    # rolling average volume
    volume_ratio = Column(Float)      # current / average
    trade_time_ms = Column(BigInteger)
