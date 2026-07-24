const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

const formatQuantity = (qty) => qty?.toFixed(6) ?? '—'

const formatTime = (tradeTime) => {
  if (!tradeTime) return '—'
  return new Date(tradeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const RecentTrades = ({ trades }) => {
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-600 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-tight">Recent Trades</h2>
          <p className="text-gray-500 text-xs font-mono mt-0.5">BTC · Latest {trades.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600">
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal">
                Trade ID
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal">
                Price
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal">
                Quantity
              </th>
              <th className="text-center px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal hidden sm:table-cell">
                Side
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal hidden md:table-cell">
                Exchange
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-mono uppercase tracking-widest font-normal">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-600 font-mono text-xs">
                  No trades available
                </td>
              </tr>
            )}
            {trades.map((trade, i) => (
              <tr
                key={trade.trade_id ?? i}
                className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors duration-100"
              >
                <td className="px-5 py-3 font-mono text-xs text-gray-500">
                  #{trade.trade_id}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-right text-white font-medium">
                  {formatPrice(trade.price)}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-right text-gray-300">
                  {formatQuantity(trade.quantity)}
                </td>
                <td className="px-5 py-3 text-center hidden sm:table-cell">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                      trade.is_market_maker
                        ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'
                        : 'text-positive border-positive/20 bg-positive/5'
                    }`}
                  >
                    {trade.is_market_maker ? 'Maker' : 'Taker'}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-right text-gray-500 hidden md:table-cell">
                  {trade.exchange}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-right text-gray-400">
                  {formatTime(trade.trade_time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentTrades
