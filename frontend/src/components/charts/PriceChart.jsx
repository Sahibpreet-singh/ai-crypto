import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { motion } from 'framer-motion'
import { formatPrice, formatTime } from '../../utils/format'

const TIME_FILTERS = [
  { label: '1m',  ms: 60_000 },
  { label: '5m',  ms: 5 * 60_000 },
  { label: '15m', ms: 15 * 60_000 },
  { label: '1h',  ms: 60 * 60_000 },
  { label: 'All', ms: Infinity },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const price = payload[0]?.value
  const isUp = payload[0]?.payload?.change >= 0

  return (
    <div className="bg-surface-700/95 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-gray-400 text-xs font-mono mb-1.5">{formatTime(label)}</p>
      <p className={`font-mono font-semibold text-base ${isUp ? 'text-positive' : 'text-negative'}`}>
        {formatPrice(price)}
      </p>
    </div>
  )
}

const PriceChart = ({ trades }) => {
  const [activeFilter, setActiveFilter] = useState('All')

  const now = Date.now()

  const chartData = useMemo(() => {
    const filter = TIME_FILTERS.find((f) => f.label === activeFilter)
    const cutoff = filter?.ms === Infinity ? 0 : now - filter.ms

    return [...trades]
      .filter((t) => t.trade_time >= cutoff)
      .sort((a, b) => a.trade_time - b.trade_time)
      .map((t, i, arr) => ({
        trade_time: t.trade_time,
        price: t.price,
        change: i > 0 ? t.price - arr[0].price : 0,
      }))
  }, [trades, activeFilter])

  const prices = chartData.map((d) => d.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const padding = (maxPrice - minPrice) * 0.08 || 100

  const latestPrice = prices[prices.length - 1]
  const firstPrice = prices[0]
  const priceChange = latestPrice && firstPrice ? latestPrice - firstPrice : null
  const pricePct = priceChange && firstPrice ? (priceChange / firstPrice) * 100 : null
  const isPositive = priceChange == null || priceChange >= 0

  const strokeColor = isPositive ? '#10b981' : '#ef4444'
  const gradientId = isPositive ? 'priceGradientGreen' : 'priceGradientRed'
  const stopColor = isPositive ? '#10b981' : '#ef4444'

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold text-sm tracking-tight">BTC / USD</h2>
            {priceChange != null && (
              <motion.span
                key={latestPrice}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`badge ${isPositive ? 'badge-green' : 'badge-red'}`}
              >
                {isPositive ? '+' : ''}{pricePct?.toFixed(2)}%
              </motion.span>
            )}
          </div>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            {chartData.length} trades · {activeFilter} window
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time selector */}
          <div className="flex items-center gap-1 bg-surface-700 rounded-lg p-1 border border-white/5">
            {TIME_FILTERS.map(({ label }) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all duration-200 ${
                  activeFilter === label
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Latest price */}
          <motion.div key={latestPrice} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-right hidden sm:block">
            <p className={`font-mono font-bold text-lg leading-none ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {formatPrice(latestPrice)}
            </p>
            {priceChange != null && (
              <p className={`text-xs font-mono mt-0.5 ${isPositive ? 'text-positive/70' : 'text-negative/70'}`}>
                {isPositive ? '+' : ''}{formatPrice(priceChange)}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-600 text-sm font-mono">
          No trade data for this window
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={stopColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={stopColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2333" vertical={false} />
            <XAxis
              dataKey="trade_time"
              tickFormatter={formatTime}
              tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={84}
            />
            <Tooltip content={<CustomTooltip />} />
            {firstPrice && (
              <ReferenceLine
                y={firstPrice}
                stroke="#4b5563"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PriceChart
