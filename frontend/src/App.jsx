import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Dashboard from './pages/Dashboard'
import { getLatestTrade } from './services/api'

const App = () => {
  const [isLive, setIsLive] = useState(true)
  const [symbol, setSymbol] = useState('BTCUSDT')

  useEffect(() => {
    const check = async () => {
      try {
        await getLatestTrade(symbol)
        setIsLive(true)
      } catch {
        setIsLive(false)
      }
    }
    check()
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [symbol])

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Subtle radial gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple/3 rounded-full blur-3xl" />
      </div>

      <Navbar isLive={isLive} symbol={symbol} onSymbolChange={setSymbol} />

      <div className="flex-1 relative">
        <Dashboard symbol={symbol} />
      </div>

      <Footer />
    </div>
  )
}

export default App
