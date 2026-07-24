import { RiBitCoinLine, RiCoinLine } from 'react-icons/ri'

const formatPrice = (price) => {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatQuantity = (qty) => {
  if (qty == null) return '—'
  return qty.toFixed(6)
}

const formatTime = (tradeTime) => {
  if (!tradeTime) return '—'
  return new Date(tradeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const icons = {
  BTC: RiBitCoinLine,
  ETH: RiCoinLine,
}

const PriceCard = ({ symbol, trade }) => {
  const Icon = icons[symbol] || RiCoinLine

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Icon className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{symbol}</p>
            <p className="text-xs text-gray-600 leading-none">
              {trade?.exchange || '—'}
            </p>
          </div>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
          trade?.is_market_maker
            ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'
            : 'text-positive border-positive/20 bg-positive/5'
        }`}>
          {trade?.is_market_maker ? 'Maker' : 'Taker'}
        </span>
      </div>

      <div>
        <p className="text-2xl sm:text-3xl font-mono font-semibold text-white tracking-tight">
          {formatPrice(trade?.price)}
        </p>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Qty: {formatQuantity(trade?.quantity)}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-surface-600 pt-3">
        <span className="text-xs text-gray-600 font-mono">
          Last trade
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {formatTime(trade?.trade_time)}
        </span>
      </div>
    </div>
  )
}

export default PriceCard
