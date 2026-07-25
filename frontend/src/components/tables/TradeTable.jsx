import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, formatQuantity, formatTime, getSideLabel, getSideColor } from '../../utils/format'
import { SkeletonRow } from '../cards/LoadingSkeleton'

const TradeTable = ({ trades, loading }) => {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight">Recent Trades</h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            BTC · {loading ? '…' : `${trades.length} trades`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green">BUY</span>
          <span className="badge badge-red">SELL</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Trade ID', 'Price', 'Quantity', 'Value', 'Side', 'Time'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal text-left first:text-left last:text-right [&:not(:first-child):not(:last-child)]:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && trades.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-600 font-mono text-xs">
                  No trades available yet
                </td>
              </tr>
            )}

            <AnimatePresence initial={false}>
              {!loading && trades.map((trade, i) => {
                const isBuy = !trade.is_market_maker
                const value = trade.price * trade.quantity

                return (
                  <motion.tr
                    key={trade.trade_id ?? i}
                    initial={{ opacity: 0, backgroundColor: isBuy ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}
                    animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0)' }}
                    transition={{ duration: 0.6 }}
                    className="border-b border-white/[0.03] hover:bg-surface-700/40 transition-colors duration-100"
                  >
                    <td className="px-5 py-2.5 font-mono text-xs text-gray-600">
                      #{trade.trade_id}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-xs text-right text-white font-medium">
                      {formatPrice(trade.price)}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-xs text-right text-gray-300">
                      {formatQuantity(trade.quantity)}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-xs text-right text-gray-400">
                      ${(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <span className={`badge ${isBuy ? 'badge-green' : 'badge-red'}`}>
                        {getSideLabel(trade.is_market_maker)}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-mono text-xs text-right text-gray-500">
                      {formatTime(trade.trade_time)}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TradeTable
