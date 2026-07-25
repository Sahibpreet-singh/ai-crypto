import { useState, useEffect, useRef, useCallback } from 'react'
import { getAnalytics } from '../services/api'

const REFRESH_INTERVAL = 2000

export const useAnalytics = (symbol = 'BTCUSDT') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const fetch = useCallback(async () => {
    try {
      const result = await getAnalytics(symbol)
      if (!mountedRef.current) return
      setData(result)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch analytics.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    mountedRef.current = true
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [fetch])

  return { data, loading, error }
}
