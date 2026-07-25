from sqlalchemy.orm import Session

from app.models.pump_event import PumpEvent


class PumpRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, pump: PumpEvent) -> PumpEvent:
        self.db.add(pump)
        self.db.commit()
        self.db.refresh(pump)
        return pump

    def get_latest(self, symbol: str, limit: int = 10):
        return (
            self.db.query(PumpEvent)
            .filter(PumpEvent.symbol == symbol)
            .order_by(PumpEvent.window_end_ms.desc())
            .limit(limit)
            .all()
        )

    def get_history(self, symbol: str, limit: int = 100):
        return (
            self.db.query(PumpEvent)
            .filter(PumpEvent.symbol == symbol)
            .order_by(PumpEvent.window_end_ms.desc())
            .limit(limit)
            .all()
        )

    def exists_in_window(self, symbol: str, event_type: str, window_start_ms: int) -> bool:
        """Prevent duplicate events in the same 5-minute window."""
        return (
            self.db.query(PumpEvent)
            .filter(
                PumpEvent.symbol == symbol,
                PumpEvent.event_type == event_type,
                PumpEvent.window_start_ms == window_start_ms,
            )
            .first()
            is not None
        )
