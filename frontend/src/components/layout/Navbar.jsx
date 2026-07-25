import { RiBitCoinLine, RiGithubLine, RiRefreshLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

const StatusDot = ({ live }) => (
  <span className="relative flex h-2 w-2">
    <span
      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
        live ? 'bg-positive' : 'bg-negative'
      }`}
    />
    <span
      className={`relative inline-flex rounded-full h-2 w-2 ${
        live ? 'bg-positive' : 'bg-negative'
      }`}
    />
  </span>
)

const Navbar = ({ isLive, symbol, onSymbolChange }) => {
  return (
    <nav className="sticky top-0 z-50 bg-surface-800/80 backdrop-blur-md border-b border-white/5 glow-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-purple/20 border border-accent/20">
            <RiBitCoinLine className="text-accent text-xl" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-positive rounded-full border border-surface-800" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-semibold text-sm leading-tight tracking-tight">
              Crypto Intelligence
            </h1>
            <p className="text-gray-500 text-xs leading-tight font-mono">Platform · BTC/USD</p>
          </div>
        </div>

        {/* Symbol Selector */}
        <div className="flex items-center gap-1 bg-surface-700 rounded-lg p-1 border border-white/5">
          {['BTCUSDT'].map((s) => (
            <button
              key={s}
              onClick={() => onSymbolChange?.(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 ${
                symbol === s
                  ? 'bg-accent text-white shadow-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s.replace('USDT', '/USDT')}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RiRefreshLine className="text-accent/60" />
            </motion.div>
            <span>2s refresh</span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5">
            <StatusDot live={isLive} />
            <span className={`text-xs font-mono font-medium tracking-wider uppercase ${
              isLive ? 'text-positive' : 'text-negative'
            }`}>
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-700 border border-white/5 text-gray-400 hover:text-white hover:border-accent/30 transition-all duration-200"
          >
            <RiGithubLine className="text-base" />
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
