"""
TradeProcessor — central processing hub.

Existing features (unchanged):
  - Trade persistence via TradeRepository
  - Redis caching via RedisService
  - Whale detection via WhaleDetector

New features wired in here:
  - Pump/Dump detection (Feature 1)  via PumpDetector
  - Volume spike detection (Feature 2) via VolumeDetector
  - Technical indicators (Features 3-5) via IndicatorService
"""

from sqlalchemy.orm import Session

from app.repositories.trade_repository import TradeRepository
from app.repositories.whale_repository import WhaleRepository
from app.services.whale_detector import WhaleDetector
from app.services.pump_detector import PumpDetector
from app.services.volume_detector import VolumeDetector
from app.services.indicator_service import IndicatorService

# ── Singleton instances (stateful across trades) ───────────────────────
# These are module-level so that the rolling windows and EMA accumulators
# survive between individual process_trade() calls.
_pump_detector = PumpDetector()
_volume_detector = VolumeDetector()
_indicator_service = IndicatorService()


def get_indicator_service() -> IndicatorService:
    """Expose the shared IndicatorService to API endpoints."""
    return _indicator_service


def get_volume_detector() -> VolumeDetector:
    """Expose the shared VolumeDetector to API endpoints."""
    return _volume_detector


class TradeProcessor:

    def __init__(self, db: Session):
        self.db = db
        self.trade_repository = TradeRepository(db)
        self.whale_repository = WhaleRepository(db)
        self.whale_detector = WhaleDetector()

    def process_trade(self, trade_event) -> None:
        """
        Process a single TradeEvent (schema object, not raw dict).

        Parameters
        ----------
        trade_event : TradeEvent
            Already mapped by BinanceMapper.
        """

        # ── 1. Persist the trade ───────────────────────────────────────
        self.trade_repository.create_trade(trade_event)

        # ── 2. Cache latest trade in Redis ─────────────────────────────
        # (RedisService is lightweight to instantiate inline)
        try:
            from app.cache.redis_service import RedisService
            RedisService().cache_latest_trade(trade_event)
            RedisService().cache_latest_price(trade_event)
        except Exception as e:
            print(f"[Redis] cache error: {e}")

        # ── 3. Whale detection ─────────────────────────────────────────
        whale = self.whale_detector.detect(trade_event)
        if whale:
            self.whale_repository.create(whale)
            print(f"\n🐋 WHALE | {whale.symbol} | ${whale.value_usd:,.2f} | {whale.side}")

        # ── 4. Pump / Dump detection ───────────────────────────────────
        pump = _pump_detector.detect(trade_event, self.db)
        if pump:
            print(f"\n🚀 {pump.event_type} | {pump.symbol} | {pump.change_pct:+.2f}%")

        # ── 5. Volume spike detection ──────────────────────────────────
        spike = _volume_detector.update(trade_event, self.db)
        if spike:
            print(f"\n📈 VOLUME SPIKE | {spike.symbol} | {spike.volume_ratio:.1f}x avg")

        # ── 6. Update in-memory technical indicators ───────────────────
        _indicator_service.update(trade_event)
