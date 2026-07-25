import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { getLatestTrade } from './services/api'

const App = () => {
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        await getLatestTrade('BTCUSDT')
        setIsLive(true)
      } catch {
        setIsLive(false)
      }
    }
    check()
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar isLive={isLive} />
      <Dashboard />
    </div>
  )
}

export default App
