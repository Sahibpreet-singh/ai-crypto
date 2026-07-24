import { RiBitCoinLine } from 'react-icons/ri'
import StatusBadge from './StatusBadge'

const Navbar = ({ isLive }) => {
  return (
    <nav className="sticky top-0 z-50 bg-surface-800/80 backdrop-blur-md border-b border-surface-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20">
            <RiBitCoinLine className="text-accent text-lg" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm sm:text-base leading-tight tracking-tight">
              Crypto Intelligence
            </h1>
            <p className="text-gray-500 text-xs leading-tight hidden sm:block">Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs font-mono hidden sm:block">
            Refresh 2s
          </span>
          <StatusBadge live={isLive} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
