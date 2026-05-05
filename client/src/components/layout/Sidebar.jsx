import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { xpToNextLevel, getLevelTitle, getAvatarUrl } from '../../utils/helpers'
import {
  LayoutDashboard, BookOpen, Trophy, Award, MessageSquare,
  BarChart2, Users, Settings, LogOut, GraduationCap,
  Zap, Star, Shield, PlusCircle, HelpCircle
} from 'lucide-react'

const navConfig = {
  student: [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/student/courses', icon: BookOpen, label: 'Courses' },
    { to: '/student/quizzes', icon: HelpCircle, label: 'Quizzes' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/student/badges', icon: Award, label: 'Badges' },
    { to: '/student/profile', icon: Settings, label: 'Profile' },
  ],
  educator: [
    { to: '/educator', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/educator/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/educator/insights', icon: BarChart2, label: 'Student Insights' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
    { to: '/admin/courses/new', icon: PlusCircle, label: 'Create Course' },
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
    <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-200 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col bg-white/95 border-r border-emerald-100 backdrop-blur-xl`}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-emerald-100">
        <div className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center shadow-sm shadow-emerald-200">
          <BookOpen size={14} className="text-white" />
        </div>
        <div>
          <h1 className="text-slate-800 font-semibold text-sm">GLearnPlatform</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.16em]">Learning Hub</p>
        </div>
      </div>

      {/* User Info */}
      <div className="mx-3 mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={user?.avatar || getAvatarUrl(user?.name || 'User')}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-emerald-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 font-medium text-sm truncate">{user?.name}</p>
            <span className={`text-xs font-medium capitalize ${
              user?.role === 'admin' ? 'text-rose-500' :
              user?.role === 'educator' ? 'text-emerald-600' :
              'text-emerald-600'
            }`}>{user?.role}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Lv.{user?.level} · {user?.xp?.toLocaleString()} XP</span>
            <span>{xpInCurrentLevel}/{xpNeeded}</span>
          </div>
          <div className="progress-bar">
            <div className="xp-bar transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {user?.role === 'student' && (
          <div className="flex gap-3 mt-2 text-xs text-slate-500">
            <span>{user?.streak}d streak</span>
            <span>{user?.points?.toLocaleString()} pts</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-emerald-100">
        <button onClick={handleLogout} className="sidebar-link w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
