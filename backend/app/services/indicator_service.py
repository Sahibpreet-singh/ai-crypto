"""
In-memory technical indicator engine.

Covers Features 3, 4 and 5:
  - Buy / Sell pressure (Feature 3)
  - Trend detection via SMA20 / SMA50 (Feature 4)
  - EMA, VWAP, RSI, MACD (Feature 5)

All state is kept in per-symbol deques so the processor can call
`update()` on every trade without any database interaction.
The computed values are read via `get_indicators()` for use by the
/analytics and dedicated API endpoints.
"""

from collections import deque, defaultdict
from typing import Optional

from app.schemas.trade_event import TradeEvent


# ── Window sizes ───────────────────────────────────────────────────────
SMA_SHORT = 20
SMA_LONG = 50
EMA_SHORT = 12      # MACD fast
EMA_LONG = 26       # MACD slow
EMA_SIGNAL = 9      # MACD signal line
RSI_PERIOD = 14
VWAP_WINDOW = 500   # trades used for rolling VWAP


class IndicatorService:
    """One instance is shared across all TradeProcessor calls."""

    def __init__(self):
        # symbol -> deque of close prices (floats)
        self._prices: dict[str, deque] = defaultdict(lambda: deque(maxlen=500))

        # symbol -> deque of (price, quantity) for VWAP
        self._pq: dict[str, deque] = defaultdict(lambda: deque(maxlen=VWAP_WINDOW))

        # symbol -> deque of (is_buy: bool, quantity: float)
        self._sides: dict[str, deque] = defaultdict(lambda: deque(maxlen=500))

        # EMA state: symbol -> {"ema12": float|None, "ema26": float|None, "signal": float|None}
        self._ema_state: dict[str, dict] = defaultdict(
            lambda: {"ema12": None, "ema26": None, "signal": None}
        )

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    def update(self, trade: TradeEvent) -> None:
        sym = trade.symbol
        price = trade.price
        qty = trade.quantity
        is_buy = not trade.is_market_maker   # market_maker = True => SELL

        self._prices[sym].append(price)
        self._pq[sym].append((price, qty))
        self._sides[sym].append((is_buy, qty))

        # Update EMA state incrementally
        state = self._ema_state[sym]
        k12 = 2 / (EMA_SHORT + 1)
        k26 = 2 / (EMA_LONG + 1)

        if state["ema12"] is None:
            state["ema12"] = price
            state["ema26"] = price
        else:
            state["ema12"] = price * k12 + state["ema12"] * (1 - k12)
            state["ema26"] = price * k26 + state["ema26"] * (1 - k26)

        macd_line = state["ema12"] - state["ema26"]
        k_sig = 2 / (EMA_SIGNAL + 1)
        if state["signal"] is None:
            state["signal"] = macd_line
        else:
            state["signal"] = macd_line * k_sig + state["signal"] * (1 - k_sig)

    # ------------------------------------------------------------------
    # Computed properties
    # ------------------------------------------------------------------

    def get_sma(self, symbol: str, period: int) -> Optional[float]:
        prices = list(self._prices[symbol])
        if len(prices) < period:
            return None
        window = prices[-period:]
        return round(sum(window) / period, 4)

    def get_ema(self, symbol: str) -> Optional[float]:
        """Return the most recent EMA-12 value."""
        v = self._ema_state[symbol]["ema12"]
        return round(v, 4) if v is not None else None

    def get_vwap(self, symbol: str) -> Optional[float]:
        pq = list(self._pq[symbol])
        if not pq:
            return None
        total_pv = sum(p * q for p, q in pq)
        total_q = sum(q for _, q in pq)
        return round(total_pv / total_q, 4) if total_q > 0 else None

    def get_rsi(self, symbol: str, period: int = RSI_PERIOD) -> Optional[float]:
        prices = list(self._prices[symbol])
        if len(prices) < period + 1:
            return None

        changes = [prices[i] - prices[i - 1] for i in range(1, len(prices))]
        recent = changes[-period:]
        gains = [c for c in recent if c > 0]
        losses = [-c for c in recent if c < 0]

        avg_gain = sum(gains) / period
        avg_loss = sum(losses) / period

        if avg_loss == 0:
            return 100.0

        rs = avg_gain / avg_loss
        return round(100 - (100 / (1 + rs)), 2)

    def get_macd(self, symbol: str) -> dict:
        state = self._ema_state[symbol]
        ema12 = state["ema12"]
        ema26 = state["ema26"]
        signal = state["signal"]

        if ema12 is None:
            return {"macd": None, "signal": None, "histogram": None}

        macd_line = ema12 - ema26
        histogram = (macd_line - signal) if signal is not None else None

        return {
            "macd": round(macd_line, 4),
            "signal": round(signal, 4) if signal is not None else None,
            "histogram": round(histogram, 4) if histogram is not None else None,
        }

    def get_buy_sell_pressure(self, symbol: str) -> dict:
        sides = list(self._sides[symbol])
        if not sides:
            return {"buy_percentage": 50.0, "sell_percentage": 50.0}

        buy_vol = sum(q for is_buy, q in sides if is_buy)
        sell_vol = sum(q for is_buy, q in sides if not is_buy)
        total = buy_vol + sell_vol

        if total == 0:
            return {"buy_percentage": 50.0, "sell_percentage": 50.0}

        buy_pct = round((buy_vol / total) * 100, 2)
        sell_pct = round(100 - buy_pct, 2)
        return {"buy_percentage": buy_pct, "sell_percentage": sell_pct}

    def get_trend(self, symbol: str) -> str:
        sma20 = self.get_sma(symbol, SMA_SHORT)
        sma50 = self.get_sma(symbol, SMA_LONG)

        if sma20 is None or sma50 is None:
            return "Insufficient data"

        diff_pct = ((sma20 - sma50) / sma50) * 100

        if diff_pct > 0.5:
            return "Bullish"
        if diff_pct < -0.5:
            return "Bearish"
        return "Sideways"

    def get_volatility(self, symbol: str, period: int = 20) -> Optional[float]:
        """Annualised volatility expressed as a percentage."""
        prices = list(self._prices[symbol])
        if len(prices) < period + 1:
            return None

        recent = prices[-(period + 1):]
        returns = [
            (recent[i] - recent[i - 1]) / recent[i - 1]
            for i in range(1, len(recent))
        ]
        if not returns:
            return None

        mean = sum(returns) / len(returns)
        variance = sum((r - mean) ** 2 for r in returns) / len(returns)
        std = variance ** 0.5

        # Annualised: sqrt(365 * 24 * 60) for per-minute trades
        volatility_pct = std * (365 * 24 * 60) ** 0.5 * 100
        return round(volatility_pct, 4)

    # ------------------------------------------------------------------
    # Aggregate snapshot
    # ------------------------------------------------------------------

    def get_indicators(self, symbol: str) -> dict:
        """Return all computed indicators for the given symbol at once."""
        macd = self.get_macd(symbol)
        pressure = self.get_buy_sell_pressure(symbol)

        return {
            "sma20": self.get_sma(symbol, SMA_SHORT),
            "sma50": self.get_sma(symbol, SMA_LONG),
            "ema": self.get_ema(symbol),
            "vwap": self.get_vwap(symbol),
            "rsi": self.get_rsi(symbol),
            "macd": macd["macd"],
            "macd_signal": macd["signal"],
            "macd_histogram": macd["histogram"],
            "buy_percentage": pressure["buy_percentage"],
            "sell_percentage": pressure["sell_percentage"],
            "trend": self.get_trend(symbol),
            "volatility": self.get_volatility(symbol),
        }
