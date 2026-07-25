import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
})

// ── Market ─────────────────────────────────────────────────────────────

/**
 * GET /market/latest/{symbol}
 * Returns: { exchange, trade_id, symbol, price, quantity, trade_time, is_market_maker }
 */
export const getLatestTrade = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get(`/market/latest/${symbol}`)
  return data
}

/**
 * GET /market/trades/{symbol}?limit=N
 * Returns: Trade[]
 */
export const getLatestTrades = async (symbol = 'BTCUSDT', limit = 100) => {
  const { data } = await api.get(`/market/trades/${symbol}`, {
    params: { limit },
  })
  return data
}

// ── Analytics ──────────────────────────────────────────────────────────

/**
 * GET /analytics?symbol=BTCUSDT
 * Returns the full analytics summary object.
 */
export const getAnalytics = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get('/analytics', { params: { symbol } })
  return data
}

// ── Pump / Dump ────────────────────────────────────────────────────────

/**
 * GET /pump/latest?symbol=BTCUSDT&limit=N
 */
export const getPumpLatest = async (symbol = 'BTCUSDT', limit = 20) => {
  const { data } = await api.get('/pump/latest', { params: { symbol, limit } })
  return data
}

/**
 * GET /pump/history?symbol=BTCUSDT&limit=N
 */
export const getPumpHistory = async (symbol = 'BTCUSDT', limit = 50) => {
  const { data } = await api.get('/pump/history', { params: { symbol, limit } })
  return data
}

// ── Volume ─────────────────────────────────────────────────────────────

/**
 * GET /volume/ratio?symbol=BTCUSDT
 * Returns: { symbol, current_volume, average_volume, volume_ratio }
 */
export const getVolumeRatio = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get('/volume/ratio', { params: { symbol } })
  return data
}

/**
 * GET /volume/spikes?symbol=BTCUSDT&limit=N
 */
export const getVolumeSpikes = async (symbol = 'BTCUSDT', limit = 20) => {
  const { data } = await api.get('/volume/spikes', { params: { symbol, limit } })
  return data
}

// ── Pressure ───────────────────────────────────────────────────────────

/**
 * GET /market/pressure?symbol=BTCUSDT
 * Returns: { buy_percentage, sell_percentage }
 */
export const getMarketPressure = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get('/market/pressure', { params: { symbol } })
  return data
}

// ── Trend ──────────────────────────────────────────────────────────────

/**
 * GET /market/trend?symbol=BTCUSDT
 * Returns: { symbol, trend, sma20, sma50 }
 */
export const getMarketTrend = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get('/market/trend', { params: { symbol } })
  return data
}

// ── Indicators ─────────────────────────────────────────────────────────

/**
 * GET /indicators?symbol=BTCUSDT
 * Returns: { symbol, ema, vwap, rsi, macd, macd_signal, macd_histogram }
 */
export const getIndicators = async (symbol = 'BTCUSDT') => {
  const { data } = await api.get('/indicators', { params: { symbol } })
  return data
}
