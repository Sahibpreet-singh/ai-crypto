import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri'

const ErrorCard = ({ message, onRetry, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-negative text-xs font-mono py-4 px-5">
        <RiErrorWarningLine />
        <span>{message || 'Failed to load data.'}</span>
        {onRetry && (
          <button onClick={onRetry} className="ml-2 underline hover:no-underline">
            retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-negative/10 border border-negative/20">
        <RiErrorWarningLine className="text-negative text-xl" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold mb-1">Failed to load market data</p>
        <p className="text-gray-500 text-sm font-mono max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-surface-700 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-accent/40 hover:text-white transition-colors"
        >
          <RiRefreshLine />
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorCard
