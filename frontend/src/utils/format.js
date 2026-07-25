/**
 * Shared formatting utilities used across the entire dashboard.
 */

export const formatPrice = (price) => {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const formatPriceCompact = (price) => {
  if (price == null) return '—'
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(2)}K`
  return formatPrice(price)
}

export const formatQuantity = (qty, decimals = 6) => {
  if (qty == null) return '—'
  return qty.toFixed(decimals)
}

export const formatPercent = (value, showSign = true) => {
  if (value == null) return '—'
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export const formatNumber = (value, decimals = 2) => {
  if (value == null) return '—'
  return value.toFixed(decimals)
}

export const formatTime = (tradeTime) => {
  if (!tradeTime) return '—'
  return new Date(tradeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatTimeShort = (tradeTime) => {
  if (!tradeTime) return '—'
  return new Date(tradeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatUSD = (value) => {
  if (value == null) return '—'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export const getSideLabel = (isMarketMaker) =>
  isMarketMaker ? 'SELL' : 'BUY'

export const getSideColor = (isMarketMaker) =>
  isMarketMaker ? 'text-negative' : 'text-positive'
