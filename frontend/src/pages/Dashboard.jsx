import { useMarketData } from '../hooks/useMarketData'
import PriceCard from '../components/PriceCard'
import PriceChart from '../components/PriceChart'
import RecentTrades from '../components/RecentTrades'
import Loading from '../components/Loading'
import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri'

const Dashboard = () => {
  const { btcLatest, trades, loading, error } = useMarketData()

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-negative/10 border border-negative/20">
          <RiErrorWarningLine className="text-negative text-xl" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Failed to load market data</p>
          <p className="text-gray-500 text-sm font-mono">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-surface-700 border border-surface-600 rounded-lg text-sm text-gray-300 hover:border-accent/40 hover:text-white transition-colors"
        >
          <RiRefreshLine />
          Retry
        </button>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PriceCard symbol="BTC" trade={btcLatest} />
      </div>

      {/* Chart */}
      <PriceChart trades={trades} />

      {/* Trades Table */}
      <RecentTrades trades={trades} />
    </main>
  )
}

export default Dashboard
