"""
Pump / Dump detector using a rolling 5-minute price window.

Logic
-----
- We keep a deque of (trade_time_ms, price) tuples per symbol.
- On every trade we:
  1. Append the new data point.
  2. Drop data points older than WINDOW_MS.
  3. Compare the current price to the oldest price still in the window.
  4. If the change exceeds THRESHOLD_PCT we fire a PUMP or DUMP event.
- Duplicate-prevention: a pump/dump event for the same symbol + same
  5-minute bucket is rejected by PumpRepository.exists_in_window().
"""

from collections import deque, defaultdict
from typing import Optional

from sqlalchemy.orm import Session

from app.models.pump_event import PumpEvent
from app.repositories.pump_repository import PumpRepository
from app.schemas.trade_event import TradeEvent


# 5-minute rolling window in milliseconds
WINDOW_MS: int = 5 * 60 * 1_000

# Price-change threshold to fire an event
THRESHOLD_PCT: float = 3.0


class PumpDetector:
    """
    Stateful detector; one instance is reused across trades so the
    per-symbol price buffers survive between calls.
    """

    def __init__(self):
        # symbol -> deque of (trade_time_ms, price)
        self._buffers: dict[str, deque] = defaultdict(deque)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect(self, trade: TradeEvent, db: Session) -> Optional[PumpEvent]:
        """
        Evaluate the trade and, if a pump/dump is detected, persist and
        return a PumpEvent.  Returns None when nothing is triggered.
        """
        buf = self._buffers[trade.symbol]

        # 1. Add the new data point
        buf.append((trade.trade_time, trade.price))

        # 2. Evict stale data points
        cutoff = trade.trade_time - WINDOW_MS
        while buf and buf[0][0] < cutoff:
            buf.popleft()

        # 3. Need at least two points to calculate a change
        if len(buf) < 2:
            return None

        window_start_ms, price_start = buf[0]
        price_end = trade.price
        window_end_ms = trade.trade_time

        change_pct = ((price_end - price_start) / price_start) * 100.0

        # 4. Check threshold
        if abs(change_pct) < THRESHOLD_PCT:
            return None

        event_type = "PUMP" if change_pct > 0 else "DUMP"

        # 5. Prevent duplicates: same symbol + same event type + same 5-min bucket
        repo = PumpRepository(db)
        if repo.exists_in_window(trade.symbol, event_type, window_start_ms):
            return None

        # 6. Persist
        pump_event = PumpEvent(
            symbol=trade.symbol,
            event_type=event_type,
            price_start=price_start,
            price_end=price_end,
            change_pct=round(change_pct, 4),
            window_start_ms=window_start_ms,
            window_end_ms=window_end_ms,
        )

        return repo.create(pump_event)
