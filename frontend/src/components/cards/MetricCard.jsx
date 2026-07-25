import { motion } from 'framer-motion'

/**
 * Reusable glassmorphism metric card.
 *
 * Props:
 *   label     string
 *   value     string | number
 *   sub       string  (optional subtitle)
 *   icon      ReactElement
 *   accent    string  ('blue' | 'green' | 'red' | 'yellow' | 'purple')
 *   badge     string  (optional badge text)
 *   loading   boolean
 */

const ACCENT_MAP = {
  blue:   { icon: 'bg-accent/10 border-accent/20 text-accent',   border: 'hover:border-accent/30',   glow: 'hover:shadow-glow' },
  green:  { icon: 'bg-positive/10 border-positive/20 text-positive', border: 'hover:border-positive/30', glow: 'hover:shadow-glow-green' },
  red:    { icon: 'bg-negative/10 border-negative/20 text-negative', border: 'hover:border-negative/30', glow: 'hover:shadow-glow-red' },
  yellow: { icon: 'bg-warning/10 border-warning/20 text-warning', border: 'hover:border-warning/30',  glow: '' },
  purple: { icon: 'bg-purple/10 border-purple/20 text-purple',   border: 'hover:border-purple/30',   glow: '' },
}

const MetricCard = ({
  label,
  value,
  sub,
  icon,
  accent = 'blue',
  badge,
  loading = false,
}) => {
  const colors = ACCENT_MAP[accent] ?? ACCENT_MAP.blue

  if (loading) {
    return (
      <div className="glass-card p-5 flex flex-col gap-3">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-36 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      className={`metric-card p-5 flex flex-col gap-3 ${colors.border} ${colors.glow}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${colors.icon}`}>
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10 text-gray-400 bg-surface-700">
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">{label}</p>
        <motion.p
          key={value}
          className="text-xl sm:text-2xl font-mono font-semibold text-white tracking-tight leading-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {value ?? '—'}
        </motion.p>
      </div>

      {/* Sub */}
      {sub && (
        <p className="text-xs text-gray-500 font-mono border-t border-white/5 pt-2">
          {sub}
        </p>
      )}
    </motion.div>
  )
}

export default MetricCard
