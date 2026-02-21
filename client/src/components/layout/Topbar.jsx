import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getAvatarUrl } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const profilePath = `/${user?.role}/profile`

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-700 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 md:hidden transition-colors">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 w-56 lg:w-72">
          <Search size={16} className="text-dark-500 shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-transparent text-dark-300 text-sm outline-none w-full placeholder-dark-500"
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/${user?.role}/courses`)}
          />
        </div>
      </div>

      {/* Right: theme + notifications + profile */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">3</span>
        </button>

        <button
          onClick={() => navigate(profilePath)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-dark-700 transition-colors"
        >
          <img
            src={user?.avatar || getAvatarUrl(user?.name || 'User')}
            alt={user?.name}
            className="w-8 h-8 rounded-lg object-cover border border-dark-600"
          />
          <div className="hidden lg:block text-left">
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-dark-500 text-xs capitalize">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Topbar
