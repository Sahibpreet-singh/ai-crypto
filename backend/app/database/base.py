from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# ── Existing models ────────────────────────────────────────────────────
from app.models.trade import Trade           # noqa: E402, F401
from app.models.whale_event import WhaleEvent  # noqa: E402, F401

# ── New models (Features 1 & 2) ───────────────────────────────────────
from app.models.pump_event import PumpEvent    # noqa: E402, F401
from app.models.volume_spike import VolumeSpike  # noqa: E402, F401
