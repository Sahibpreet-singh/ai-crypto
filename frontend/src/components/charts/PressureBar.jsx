import { motion } from 'framer-motion'
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

const PressureBar = ({ buyPct, sellPct, loading }) => {
  const buy = buyPct ?? 50
  const sell = sellPct ?? 50
  const dominance = buy > sell ? 'BUY' : 'SELL'

  if (loading) {
    return (
      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-6 w-full rounded-full" />
        <div className="flex justify-between">
          <div className="skeleton h-10 w-24 rounded" />
          <div className="skeleton h-10 w-24 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Buy / Sell Pressure</p>
          <p className="text-xs text-gray-600 font-mono mt-0.5">Last 500 trades</p>
        </div>
        <span className={`badge ${dominance === 'BUY' ? 'badge-green' : 'badge-red'}`}>
          {dominance} dominant
        </span>
      </div>

      {/* Combined bar */}
      <div className="relative h-4 rounded-full overflow-hidden bg-surface-700 flex">
        <motion.div
          className="h-full bg-gradient-to-r from-positive/80 to-positive rounded-l-full"
          initial={{ width: 0 }}
          animate={{ width: `${buy}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full bg-gradient-to-r from-negative to-negative/80 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${sell}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Center marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-800/60" />
      </div>

      {/* Labels */}
      <div className="grid grid-cols-2 gap-3">
        {/* Buy */}
        <div className="flex flex-col gap-1 bg-positive/5 border border-positive/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <RiArrowUpLine className="text-positive text-sm" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Buy</span>
          </div>
          <motion.p
            key={buy}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-mono font-bold text-positive leading-none"
          >
            {buy.toFixed(1)}%
          </motion.p>
          <div className="h-1 rounded-full bg-surface-700 overflow-hidden">
            <motion.div
              className="h-full bg-positive rounded-full"
              animate={{ width: `${buy}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Sell */}
        <div className="flex flex-col gap-1 bg-negative/5 border border-negative/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <RiArrowDownLine className="text-negative text-sm" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Sell</span>
          </div>
          <motion.p
            key={sell}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-mono font-bold text-negative leading-none"
          >
            {sell.toFixed(1)}%
          </motion.p>
          <div className="h-1 rounded-full bg-surface-700 overflow-hidden">
            <motion.div
              className="h-full bg-negative rounded-full"
              animate={{ width: `${sell}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PressureBar
