import { useState, useEffect, useRef, useCallback } from 'react'
import { getLatestTrade, getLatestTrades } from '../services/api'

const REFRESH_INTERVAL = 2000

export const useMarketData = () => {
  const [btcLatest, setBtcLatest] = useState(null)
  const [ethLatest, setEthLatest] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  const fetchAll = useCallback(async () => {
    try {
      const [btc, eth, tradeList] = await Promise.all([
        getLatestTrade('BTC'),
        getLatestTrade('ETH'),
        getLatestTrades('BTC', 100),
      ])

      if (!mountedRef.current) return

      setBtcLatest(btc)
      setEthLatest(eth)
      setTrades(tradeList)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch market data.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchAll()
    intervalRef.current = setInterval(fetchAll, REFRESH_INTERVAL)

    return () => {
      mountedRef.current = false
      clearInterval(intervalRef.current)
    }
  }, [fetchAll])

  return { btcLatest, ethLatest, trades, loading, error }
}
