"""
Analytics API — all new endpoints.

Feature 1  : GET /pump/latest, GET /pump/history
Feature 2  : GET /volume/ratio
Feature 3  : GET /market/pressure
Feature 4  : GET /market/trend
Feature 5  : GET /indicators
Feature 6  : GET /analytics
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.repositories.pump_repository import PumpRepository
from app.repositories.volume_repository import VolumeRepository
from app.processors.trade_processor import get_indicator_service, get_volume_detector
from app.cache.redis_service import RedisService
from app.repositories.whale_repository import WhaleRepository

router = APIRouter(tags=["Analytics"])

redis_service = RedisService()


# ── DB dependency ──────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Feature 1 — Pump / Dump Detection ─────────────────────────────────

@router.get("/pump/latest")
def pump_latest(symbol: str = "BTCUSDT", limit: int = 10, db: Session = Depends(get_db)):
    """Return the most recent pump/dump events for a symbol."""
    repo = PumpRepository(db)
    events = repo.get_latest(symbol.upper(), limit)
    return events


@router.get("/pump/history")
def pump_history(symbol: str = "BTCUSDT", limit: int = 100, db: Session = Depends(get_db)):
    """Return full pump/dump history for a symbol."""
    repo = PumpRepository(db)
    events = repo.get_history(symbol.upper(), limit)
    return events


# ── Feature 2 — Volume Spike Detection ────────────────────────────────

@router.get("/volume/ratio")
def volume_ratio(symbol: str = "BTCUSDT", db: Session = Depends(get_db)):
    """
    Return the current volume ratio for a symbol.

    Example response:
    {
      "symbol": "BTCUSDT",
      "current_volume": 12.4,
      "average_volume": 2.6,
      "volume_ratio": 4.8
    }
    """
    detector = get_volume_detector()
    return detector.get_current_ratio(symbol.upper())


@router.get("/volume/spikes")
def volume_spikes(symbol: str = "BTCUSDT", limit: int = 20, db: Session = Depends(get_db)):
    """Return persisted volume spike events."""
    repo = VolumeRepository(db)
    return repo.get_latest(symbol.upper(), limit)


# ── Feature 3 — Buy / Sell Pressure ───────────────────────────────────

@router.get("/market/pressure")
def market_pressure(symbol: str = "BTCUSDT"):
    """
    Return buy/sell pressure for a symbol.

    Example response:
    {
      "buy_percentage": 68.3,
      "sell_percentage": 31.7
    }
    """
    svc = get_indicator_service()
    return svc.get_buy_sell_pressure(symbol.upper())


# ── Feature 4 — Trend Detection ───────────────────────────────────────

@router.get("/market/trend")
def market_trend(symbol: str = "BTCUSDT"):
    """
    Return the current market trend based on SMA20 vs SMA50.

    Example response:
    {
      "symbol": "BTCUSDT",
      "trend": "Bullish",
      "sma20": 64198.6,
      "sma50": 64087.3
    }
    """
    svc = get_indicator_service()
    return {
        "symbol": symbol.upper(),
        "trend": svc.get_trend(symbol.upper()),
        "sma20": svc.get_sma(symbol.upper(), 20),
        "sma50": svc.get_sma(symbol.upper(), 50),
    }


# ── Feature 5 — Technical Indicators ──────────────────────────────────

@router.get("/indicators")
def technical_indicators(symbol: str = "BTCUSDT"):
    """
    Return EMA, VWAP, RSI, and MACD for a symbol.

    Example response:
    {
      "ema": 64198.6,
      "vwap": 64150.2,
      "rsi": 71.4,
      "macd": 32.5,
      "macd_signal": 28.1,
      "macd_histogram": 4.4
    }
    """
    svc = get_indicator_service()
    macd = svc.get_macd(symbol.upper())
    return {
        "symbol": symbol.upper(),
        "ema": svc.get_ema(symbol.upper()),
        "vwap": svc.get_vwap(symbol.upper()),
        "rsi": svc.get_rsi(symbol.upper()),
        "macd": macd["macd"],
        "macd_signal": macd["signal"],
        "macd_histogram": macd["histogram"],
    }


# ── Feature 6 — Market Analytics Summary ──────────────────────────────

@router.get("/analytics")
def market_analytics(symbol: str = "BTCUSDT", db: Session = Depends(get_db)):
    """
    Unified analytics endpoint combining all features.

    Example response:
    {
      "symbol": "BTCUSDT",
      "price": 64251.72,
      "trend": "Bullish",
      "buy_pressure": 68.3,
      "sell_pressure": 31.7,
      "volume_ratio": 4.8,
      "whale_events": 7,
      "pump_detected": true,
      "rsi": 71.4,
      "ema20": 64198.6,
      "sma50": 64087.3,
      "volatility": 2.3
    }
    """
    sym = symbol.upper()
    svc = get_indicator_service()
    volume_det = get_volume_detector()
    pump_repo = PumpRepository(db)
    whale_repo = WhaleRepository(db)

    # Latest price from Redis (falls back to None gracefully)
    latest_trade = redis_service.get_latest_trade(sym)
    latest_price = latest_trade.price if latest_trade else None

    pressure = svc.get_buy_sell_pressure(sym)
    macd = svc.get_macd(sym)
    volume_info = volume_det.get_current_ratio(sym)

    # Recent pump events in the last 5 minutes
    recent_pumps = pump_repo.get_latest(sym, limit=1)
    pump_detected = len(recent_pumps) > 0

    # Whale count from last 100 persisted events
    whale_events = len(whale_repo.get_latest(sym, limit=100))

    return {
        "symbol": sym,
        "price": latest_price,
        "trend": svc.get_trend(sym),
        "buy_pressure": pressure["buy_percentage"],
        "sell_pressure": pressure["sell_percentage"],
        "volume_ratio": volume_info["volume_ratio"],
        "whale_events": whale_events,
        "pump_detected": pump_detected,
        "rsi": svc.get_rsi(sym),
        "ema": svc.get_ema(sym),
        "sma20": svc.get_sma(sym, 20),
        "sma50": svc.get_sma(sym, 50),
        "vwap": svc.get_vwap(sym),
        "macd": macd["macd"],
        "macd_signal": macd["signal"],
        "volatility": svc.get_volatility(sym),
    }
