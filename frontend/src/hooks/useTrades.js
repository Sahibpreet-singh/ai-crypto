import { useState, useEffect, useRef, useCallback } from 'react'
import { getLatestTrades } from '../services/api'

const REFRESH_INTERVAL = 2000

export const useTrades = (symbol = 'BTCUSDT', limit = 100) => {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const fetch = useCallback(async () => {
    try {
      const result = await getLatestTrades(symbol, limit)
      if (!mountedRef.current) return
      setTrades(result)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch trades.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [symbol, limit])

  useEffect(() => {
    mountedRef.current = true
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [fetch])

  return { trades, loading, error }
}
