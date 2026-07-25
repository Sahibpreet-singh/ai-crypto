from sqlalchemy.orm import Session

from app.models.volume_spike import VolumeSpike


class VolumeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, spike: VolumeSpike) -> VolumeSpike:
        self.db.add(spike)
        self.db.commit()
        self.db.refresh(spike)
        return spike

    def get_latest(self, symbol: str, limit: int = 10):
        return (
            self.db.query(VolumeSpike)
            .filter(VolumeSpike.symbol == symbol)
            .order_by(VolumeSpike.trade_time_ms.desc())
            .limit(limit)
            .all()
        )
