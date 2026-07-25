import { motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../../utils/format'

const SpikeCard = ({ spike, index }) => {
  const ratio = spike.volume_ratio ?? 0
  const intensity = ratio > 10 ? 'Extreme' : ratio > 5 ? 'High' : 'Moderate'
  const intColor = intensity === 'Extreme' ? 'text-negative' : intensity === 'High' ? 'text-warning' : 'text-positive'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="shrink-0 w-44 flex flex-col gap-2 p-3 rounded-xl bg-warning/5 border border-warning/15 hover:border-warning/30 transition-all duration-200 hover:scale-[1.02] cursor-default"
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">🔥</span>
        <span className="badge badge-yellow">SPIKE</span>
      </div>

      <div>
        <p className="text-base font-mono font-bold leading-none text-warning">
          {ratio.toFixed(1)}x Avg
        </p>
        <p className="text-xs text-gray-500 font-mono mt-0.5">{spike.symbol || 'BTCUSDT'}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-2">
        <span className={`text-xs font-mono ${intColor}`}>
          {intensity}
        </span>
        <span className="text-xs text-gray-600 font-mono">
          {formatTime(spike.trade_time_ms)}
        </span>
      </div>
    </motion.div>
  )
}

const VolumeSpikeList = ({ spikes, volumeRatio, loading }) => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight">
            🔥 Volume Spikes
          </h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            {volumeRatio?.volume_ratio != null
              ? `Current: ${volumeRatio.volume_ratio.toFixed(1)}x average`
              : '1-min vs 30-min rolling average'}
          </p>
        </div>
        {volumeRatio?.volume_ratio != null && (
          <span className={`badge ${
            volumeRatio.volume_ratio >= 3
              ? 'badge-red'
              : volumeRatio.volume_ratio >= 1.5
              ? 'badge-yellow'
              : 'badge-blue'
          }`}>
            {volumeRatio.volume_ratio.toFixed(1)}x
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-28 skeleton rounded-xl" />
          ))}
        </div>
      ) : !spikes?.length ? (
        <div className="flex items-center justify-center h-24 text-gray-600 text-xs font-mono">
          No volume spikes detected yet
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          <AnimatePresence>
            {spikes.map((s, i) => (
              <SpikeCard key={s.id ?? i} spike={s} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default VolumeSpikeList
