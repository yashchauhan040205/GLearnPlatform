import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../context/AuthContext'
import { initSocket } from '../../services/socket'
import AchievementPopup from '../gamification/AchievementPopup'

const DashboardLayout = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [achievement, setAchievement] = useState(null)

  useEffect(() => {
    if (user) {
      const socket = initSocket(user._id)
      socket.on('leaderboard:update', () => {})
      socket.on('achievement:unlocked', (badge) => {
        setAchievement(badge)
        setTimeout(() => setAchievement(null), 4000)
      })
    }
  }, [user])

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Achievement popup */}
      {achievement && (
        <AchievementPopup badge={achievement} onClose={() => setAchievement(null)} />
      )}
    </div>
  )
}

export default DashboardLayout
