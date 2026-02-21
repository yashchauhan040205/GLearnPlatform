import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { xpToNextLevel, getLevelTitle, getAvatarUrl } from '../../utils/helpers'
import {
  LayoutDashboard, BookOpen, Trophy, Award, MessageSquare,
  BarChart2, Users, Settings, LogOut, GraduationCap,
  Zap, Star, Shield, PlusCircle
} from 'lucide-react'

const navConfig = {
  student: [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/student/courses', icon: BookOpen, label: 'Courses' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/student/badges', icon: Award, label: 'Badges' },
    { to: '/student/profile', icon: Settings, label: 'Profile' },
  ],
  educator: [
    { to: '/educator', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/educator/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/educator/courses/new', icon: PlusCircle, label: 'Create Course' },
    { to: '/educator/insights', icon: BarChart2, label: 'Student Insights' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ],
}

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { currentLevel, xpInCurrentLevel, xpNeeded, progress } = xpToNextLevel(user?.xp || 0)
  const navItems = navConfig[user?.role] || navConfig.student

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col bg-dark-900 border-r border-dark-700`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-700">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">GLearnPlatform</h1>
          <p className="text-primary-400 text-xs font-medium">Gamified Learning</p>
        </div>
      </div>

      {/* User XP Card */}
      <div className="mx-3 mt-4 p-4 bg-gradient-to-br from-primary-900/40 to-purple-900/30 rounded-xl border border-primary-700/30">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.avatar || getAvatarUrl(user?.name || 'User')}
            alt={user?.name}
            className="w-10 h-10 rounded-full border-2 border-primary-500/50 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                user?.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' :
                user?.role === 'educator' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-primary-500/20 text-primary-400'
              }`}>{user?.role}</span>
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Lv.{user?.level}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span className="flex items-center gap-1"><Zap size={10} className="text-primary-400" />{user?.xp?.toLocaleString()} XP</span>
            <span>{xpInCurrentLevel}/{xpNeeded}</span>
          </div>
          <div className="progress-bar">
            <div className="xp-bar transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {user?.role === 'student' && (
          <div className="flex gap-3 mt-3 text-xs text-dark-400">
            <span className="flex items-center gap-1">🔥 <span className="text-orange-400 font-medium">{user?.streak}d</span> streak</span>
            <span className="flex items-center gap-1"><Shield size={10} className="text-primary-400" /> <span className="text-primary-300 font-medium">{user?.points?.toLocaleString()}pts</span></span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-dark-700">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
