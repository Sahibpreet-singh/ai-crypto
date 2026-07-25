import { motion } from 'framer-motion'
import {
  RiBitCoinLine,
  RiLineChartLine,
  RiPulseLine,
  RiBarChartLine,
  RiShieldLine,
  RiDropLine,
  RiTimeLine,
} from 'react-icons/ri'

import { useAnalytics } from '../hooks/useAnalytics'
import { useTrades } from '../hooks/useTrades'
import { useMarket } from '../hooks/useMarket'

import MetricCard from '../components/cards/MetricCard'
import ErrorCard from '../components/cards/ErrorCard'
import PriceChart from '../components/charts/PriceChart'
import PressureBar from '../components/charts/PressureBar'
import TradeTable from '../components/tables/TradeTable'
import WhaleList from '../components/alerts/WhaleList'
import PumpList from '../components/alerts/PumpList'
import VolumeSpikeList from '../components/alerts/VolumeSpikeList'

import { formatPrice, formatPercent, formatNumber } from '../utils/format'

// Stagger animation config for cards
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const getTrendAccent = (trend) => {
  if (!trend) return 'blue'
  if (trend === 'Bullish') return 'green'
  if (trend === 'Bearish') return 'red'
  return 'blue'
}

const getRsiAccent = (rsi) => {
  if (rsi == null) return 'blue'
  if (rsi > 70) return 'red'
  if (rsi < 30) return 'green'
  return 'blue'
}

const Dashboard = ({ symbol = 'BTCUSDT' }) => {
  const { data: analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics(symbol)
  const { trades, loading: tradesLoading, error: tradesError } = useTrades(symbol, 100)
  const { pumps, volumeSpikes, volumeRatio, loading: marketLoading } = useMarket(symbol)

  // Show full-page error only on complete analytics failure
  if (analyticsError && !analytics) {
    return (
      <ErrorCard
        message={analyticsError}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const a = analytics ?? {}

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Hero Metric Cards ──────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3"
      >
        <MetricCard
          label="BTC Price"
          value={formatPrice(a.price)}
          icon={<RiBitCoinLine className="text-sm" />}
          accent="blue"
          badge="Live"
          loading={analyticsLoading && !a.price}
        />
        <MetricCard
          label="Trend"
          value={a.trend ?? '—'}
          sub={`SMA20 ${formatPrice(a.sma20)}`}
          icon={<RiLineChartLine className="text-sm" />}
          accent={getTrendAccent(a.trend)}
          loading={analyticsLoading && !a.trend}
        />
        <MetricCard
          label="RSI (14)"
          value={a.rsi != null ? formatNumber(a.rsi) : '—'}
          sub={a.rsi > 70 ? 'Overbought' : a.rsi < 30 ? 'Oversold' : 'Neutral'}
          icon={<RiPulseLine className="text-sm" />}
          accent={getRsiAccent(a.rsi)}
          loading={analyticsLoading && !a.rsi}
        />
        <MetricCard
          label="EMA"
          value={formatPrice(a.ema)}
          sub="Exponential MA"
          icon={<RiLineChartLine className="text-sm" />}
          accent="purple"
          loading={analyticsLoading && !a.ema}
        />
        <MetricCard
          label="VWAP"
          value={formatPrice(a.vwap)}
          sub="Vol-weighted avg"
          icon={<RiBarChartLine className="text-sm" />}
          accent="blue"
          loading={analyticsLoading && !a.vwap}
        />
        <MetricCard
          label="Volatility"
          value={a.volatility != null ? `${formatNumber(a.volatility, 1)}%` : '—'}
          sub="Annualised"
          icon={<RiShieldLine className="text-sm" />}
          accent={a.volatility > 80 ? 'red' : a.volatility > 40 ? 'yellow' : 'green'}
          loading={analyticsLoading && !a.volatility}
        />
        <MetricCard
          label="Whale Events"
          value={a.whale_events ?? '—'}
          sub={a.pump_detected ? '🚀 Pump active' : 'No pump'}
          icon={<RiDropLine className="text-sm" />}
          accent={a.whale_events > 0 ? 'yellow' : 'blue'}
          loading={analyticsLoading && a.whale_events == null}
        />
      </motion.div>

      {/* ── Main Chart + Pressure ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PriceChart trades={trades} />
        </div>
        <div>
          <PressureBar
            buyPct={a.buy_pressure}
            sellPct={a.sell_pressure}
            loading={analyticsLoading && !a.buy_pressure}
          />
        </div>
      </div>

      {/* ── Alert Rows ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WhaleList
          whaleCount={a.whale_events}
          trades={trades}
          loading={tradesLoading}
        />
        <PumpList
          pumps={pumps}
          loading={marketLoading}
        />
        <VolumeSpikeList
          spikes={volumeSpikes}
          volumeRatio={volumeRatio}
          loading={marketLoading}
        />
      </div>

      {/* ── SMA / MACD Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="SMA 20"
          value={formatPrice(a.sma20)}
          icon={<RiTimeLine className="text-sm" />}
          accent="blue"
          loading={analyticsLoading && !a.sma20}
        />
        <MetricCard
          label="SMA 50"
          value={formatPrice(a.sma50)}
          icon={<RiTimeLine className="text-sm" />}
          accent="purple"
          loading={analyticsLoading && !a.sma50}
        />
        <MetricCard
          label="MACD"
          value={a.macd != null ? formatNumber(a.macd) : '—'}
          sub={`Signal: ${a.macd_signal != null ? formatNumber(a.macd_signal) : '—'}`}
          icon={<RiLineChartLine className="text-sm" />}
          accent={a.macd > 0 ? 'green' : 'red'}
          loading={analyticsLoading && a.macd == null}
        />
        <MetricCard
          label="Volume Ratio"
          value={volumeRatio?.volume_ratio != null ? `${volumeRatio.volume_ratio.toFixed(1)}x` : '—'}
          sub="1m vs 30m avg"
          icon={<RiBarChartLine className="text-sm" />}
          accent={volumeRatio?.volume_ratio >= 3 ? 'red' : volumeRatio?.volume_ratio >= 1.5 ? 'yellow' : 'green'}
          loading={marketLoading && !volumeRatio}
        />
      </div>

      {/* ── Trade Table ───────────────────────────────────────────── */}
      <TradeTable trades={trades} loading={tradesLoading} />

    </main>
  )
}

export default Dashboard
