"""
Volume-spike detector.

Strategy
--------
- Short window  (1 min):  current volume.
- Long window   (30 min): rolling average volume.
- Spike ratio   = current / average.
- A spike is persisted when ratio >= SPIKE_THRESHOLD.
"""

from collections import deque, defaultdict
from typing import Optional

from sqlalchemy.orm import Session

from app.models.volume_spike import VolumeSpike
from app.repositories.volume_repository import VolumeRepository
from app.schemas.trade_event import TradeEvent


SHORT_WINDOW_MS: int = 60 * 1_000          # 1 minute
LONG_WINDOW_MS: int = 30 * 60 * 1_000      # 30 minutes
SPIKE_THRESHOLD: float = 3.0               # 3× average = spike


class VolumeDetector:

    def __init__(self):
        # symbol -> deque[(trade_time_ms, quantity)]
        self._short: dict[str, deque] = defaultdict(deque)
        self._long: dict[str, deque] = defaultdict(deque)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def update(self, trade: TradeEvent, db: Session) -> Optional[VolumeSpike]:
        """
        Update rolling windows and return a persisted VolumeSpike when a
        spike is detected, otherwise None.
        """
        ts = trade.trade_time
        qty = trade.quantity

        short_buf = self._short[trade.symbol]
        long_buf = self._long[trade.symbol]

        short_buf.append((ts, qty))
        long_buf.append((ts, qty))

        # Evict stale data
        short_cutoff = ts - SHORT_WINDOW_MS
        long_cutoff = ts - LONG_WINDOW_MS

        while short_buf and short_buf[0][0] < short_cutoff:
            short_buf.popleft()
        while long_buf and long_buf[0][0] < long_cutoff:
            long_buf.popleft()

        if len(long_buf) < 10:
            # Not enough history yet
            return None

        current_volume = sum(q for _, q in short_buf)
        average_volume = sum(q for _, q in long_buf) / max(
            1, (LONG_WINDOW_MS / SHORT_WINDOW_MS)
        )

        if average_volume <= 0:
            return None

        ratio = current_volume / average_volume

        if ratio < SPIKE_THRESHOLD:
            return None

        spike = VolumeSpike(
            symbol=trade.symbol,
            current_volume=round(current_volume, 8),
            average_volume=round(average_volume, 8),
            volume_ratio=round(ratio, 4),
            trade_time_ms=ts,
        )

        repo = VolumeRepository(db)
        return repo.create(spike)

    def get_current_ratio(self, symbol: str) -> dict:
        """Return the current volume ratio without persisting anything."""
        short_buf = self._short.get(symbol, deque())
        long_buf = self._long.get(symbol, deque())

        current_volume = sum(q for _, q in short_buf)
        periods = max(1, LONG_WINDOW_MS / SHORT_WINDOW_MS)
        average_volume = sum(q for _, q in long_buf) / periods if long_buf else 0.0
        ratio = (current_volume / average_volume) if average_volume > 0 else 0.0

        return {
            "symbol": symbol,
            "current_volume": round(current_volume, 8),
            "average_volume": round(average_volume, 8),
            "volume_ratio": round(ratio, 4),
        }
