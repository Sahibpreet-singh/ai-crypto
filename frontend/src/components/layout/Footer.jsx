import {
  SiApachekafka,
  SiFastapi,
  SiRedis,
  SiPostgresql,
  SiReact,
} from 'react-icons/si'
import { RiBitCoinLine } from 'react-icons/ri'

const STACK = [
  { icon: SiApachekafka,  label: 'Kafka',      color: 'text-orange-400' },
  { icon: SiFastapi,      label: 'FastAPI',     color: 'text-teal-400' },
  { icon: SiRedis,        label: 'Redis',       color: 'text-red-400' },
  { icon: SiPostgresql,   label: 'PostgreSQL',  color: 'text-blue-400' },
  { icon: SiReact,        label: 'React',       color: 'text-cyan-400' },
  { icon: RiBitCoinLine,  label: 'Binance',     color: 'text-yellow-400' },
]

const Footer = () => (
  <footer className="border-t border-white/5 bg-surface-800/40 mt-12">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Stack pills */}
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          {STACK.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5 hover:border-white/10 transition-colors duration-200"
            >
              <Icon className={`text-sm ${color}`} />
              <span className="text-xs font-mono text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right">
          <p className="text-xs font-mono text-gray-600">
            Crypto Intelligence Platform
          </p>
          <p className="text-xs font-mono text-gray-700 mt-0.5">
            Real-time BTC analytics · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
