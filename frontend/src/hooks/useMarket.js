import { useState, useEffect, useRef, useCallback } from 'react'
import {
  getPumpLatest,
  getVolumeSpikes,
  getVolumeRatio,
} from '../services/api'

const REFRESH_INTERVAL = 2000

export const useMarket = (symbol = 'BTCUSDT') => {
  const [pumps, setPumps] = useState([])
  const [volumeSpikes, setVolumeSpikes] = useState([])
  const [volumeRatio, setVolumeRatio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const fetch = useCallback(async () => {
    try {
      const [pumpData, spikeData, ratioData] = await Promise.all([
        getPumpLatest(symbol, 20),
        getVolumeSpikes(symbol, 20),
        getVolumeRatio(symbol),
      ])
      if (!mountedRef.current) return
      setPumps(pumpData)
      setVolumeSpikes(spikeData)
      setVolumeRatio(ratioData)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch market data.')
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

  return { pumps, volumeSpikes, volumeRatio, loading, error }
}
