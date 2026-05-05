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
      const handleLeaderboard = () => {}
      const handleAchievement = (badge) => {
        setAchievement(badge)
        setTimeout(() => setAchievement(null), 4000)
      }
      socket.on('leaderboard:update', handleLeaderboard)
      socket.on('achievement:unlocked', handleAchievement)
      return () => {
        socket.off('leaderboard:update', handleLeaderboard)
        socket.off('achievement:unlocked', handleAchievement)
      }
    }
  }, [user])

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-white text-slate-800">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-emerald-950/15 z-30 md:hidden"
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
