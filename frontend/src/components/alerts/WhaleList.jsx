import { motion, AnimatePresence } from 'framer-motion'
import { formatUSD, formatTime } from '../../utils/format'

const WhaleCard = ({ whale, index }) => {
  const isBuy = whale.side === 'BUY'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`shrink-0 w-44 flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default ${
        isBuy
          ? 'bg-positive/5 border-positive/15 hover:border-positive/30'
          : 'bg-negative/5 border-negative/15 hover:border-negative/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">🐋</span>
        <span className={`badge ${isBuy ? 'badge-green' : 'badge-red'}`}>
          {whale.side}
        </span>
      </div>

      <div>
        <p className={`text-base font-mono font-bold leading-none ${isBuy ? 'text-positive' : 'text-negative'}`}>
          {formatUSD(whale.value_usd)}
        </p>
        <p className="text-xs text-gray-500 font-mono mt-0.5">{whale.symbol}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-2">
        <span className="text-xs text-gray-600 font-mono">
          {formatTime(whale.trade_time)}
        </span>
        <span className="text-xs text-gray-600 font-mono">
          {whale.quantity?.toFixed(3)} BTC
        </span>
      </div>
    </motion.div>
  )
}

const WhaleList = ({ whaleCount, trades, loading }) => {
  // Derive whale-like trades from the trades list (value > $50k) as a proxy
  // since we don't have a direct /whale endpoint — the analytics gives us count
  const whales = trades
    ? trades
        .filter((t) => t.price * t.quantity > 50_000)
        .slice(0, 20)
        .map((t) => ({
          side: t.is_market_maker ? 'SELL' : 'BUY',
          value_usd: t.price * t.quantity,
          symbol: t.symbol || 'BTCUSDT',
          trade_time: t.trade_time,
          quantity: t.quantity,
        }))
    : []

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight flex items-center gap-2">
            🐋 Whale Alerts
          </h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            {whaleCount != null ? `${whaleCount} total detected` : 'Large trades > $50K'}
          </p>
        </div>
        {whaleCount != null && (
          <span className="badge badge-blue">{whaleCount} whales</span>
        )}
      </div>

      {/* Horizontal scrollable list */}
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-28 skeleton rounded-xl" />
          ))}
        </div>
      ) : whales.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-gray-600 text-xs font-mono">
          No whale trades detected yet
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          <AnimatePresence>
            {whales.map((w, i) => (
              <WhaleCard key={`${w.trade_time}-${i}`} whale={w} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default WhaleList
