import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const formatTime = (tradeTime) => {
  if (!tradeTime) return ''
  return new Date(tradeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-600 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-gray-400 text-xs font-mono mb-1">{formatTime(label)}</p>
      <p className="text-white font-mono font-semibold text-sm">
        {formatPrice(payload[0]?.value)}
      </p>
    </div>
  )
}

const PriceChart = ({ trades }) => {
  const chartData = [...trades]
    .sort((a, b) => a.trade_time - b.trade_time)
    .map((t) => ({
      trade_time: t.trade_time,
      price: t.price,
    }))

  const prices = chartData.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.05 || 1

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight">BTC / USD</h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">Last 100 trades</p>
        </div>
        <div className="text-right">
          <p className="text-white font-mono font-semibold text-lg">
            {prices.length ? formatPrice(prices[prices.length - 1]) : '—'}
          </p>
          <p className="text-xs text-gray-500 font-mono">Latest</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-600 text-sm font-mono">
          No trade data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2d42"
              vertical={false}
            />
            <XAxis
              dataKey="trade_time"
              tickFormatter={formatTime}
              tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PriceChart
