import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000,
})

/**
 * Fetch the latest trade for a symbol.
 * Returns a TradeEvent: { exchange, trade_id, symbol, price, quantity, trade_time, is_market_maker }
 */
export const getLatestTrade = async (symbol) => {
  const { data } = await api.get(`/market/latest/${symbol}`)
  return data
}

/**
 * Fetch the latest N trades for a symbol.
 * Returns an array of TradeEvent objects.
 */
export const getLatestTrades = async (symbol, limit = 100) => {
  const { data } = await api.get(`/market/trades/${symbol}`, {
    params: { limit },
  })
  return data
}
