import { motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../../utils/format'

const PumpCard = ({ pump, index }) => {
  const isPump = pump.event_type === 'PUMP'
  const pct = Math.abs(pump.change_pct)

  // Confidence based on % magnitude
  const confidence = pct > 8 ? 'High' : pct > 5 ? 'Medium' : 'Low'
  const confColor = confidence === 'High' ? 'text-positive' : confidence === 'Medium' ? 'text-warning' : 'text-gray-400'

  const windowMin = pump.window_start_ms
    ? Math.round((pump.window_end_ms - pump.window_start_ms) / 60_000)
    : 5

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`shrink-0 w-44 flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default ${
        isPump
          ? 'bg-positive/5 border-positive/15 hover:border-positive/30'
          : 'bg-negative/5 border-negative/15 hover:border-negative/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">{isPump ? '🚀' : '📉'}</span>
        <span className={`badge ${isPump ? 'badge-green' : 'badge-red'}`}>
          {pump.event_type}
        </span>
      </div>

      <div>
        <p className={`text-base font-mono font-bold leading-none ${isPump ? 'text-positive' : 'text-negative'}`}>
          {isPump ? '+' : '-'}{pct.toFixed(2)}%
        </p>
        <p className="text-xs text-gray-500 font-mono mt-0.5">{windowMin} min window</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-2">
        <span className={`text-xs font-mono ${confColor}`}>
          {confidence} conf.
        </span>
        <span className="text-xs text-gray-600 font-mono">
          {formatTime(pump.window_end_ms)}
        </span>
      </div>
    </motion.div>
  )
}

const PumpList = ({ pumps, loading }) => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight">
            🚀 Pump / Dump Alerts
          </h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            5-min rolling window · ±3% threshold
          </p>
        </div>
        {pumps?.length > 0 && (
          <span className="badge badge-yellow">{pumps.length} events</span>
        )}
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-28 skeleton rounded-xl" />
          ))}
        </div>
      ) : !pumps?.length ? (
        <div className="flex items-center justify-center h-24 text-gray-600 text-xs font-mono">
          No pump/dump events detected yet
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          <AnimatePresence>
            {pumps.map((p, i) => (
              <PumpCard key={p.id ?? i} pump={p} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default PumpList
