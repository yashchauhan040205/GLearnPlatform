import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAvatarUrl } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const profilePath = `/${user?.role}/profile`

  return (
    <header className="h-14 bg-dark-900/80 border-b border-dark-800/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 md:hidden transition-colors">
          <Menu size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-dark-950/80 border border-dark-700 rounded-full px-3 py-1.5 w-52 lg:w-64">
          <Search size={14} className="text-dark-500 shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-transparent text-dark-200 text-sm outline-none w-full placeholder-dark-500"
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/${user?.role}/courses`)}
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors relative">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center leading-none">3</span>
        </button>

        <button
          onClick={() => navigate(profilePath)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-dark-800 transition-colors"
        >
          <img
            src={user?.avatar || getAvatarUrl(user?.name || 'User')}
            alt={user?.name}
            className="w-7 h-7 rounded-full object-cover border border-dark-800"
          />
          <div className="hidden lg:block text-left">
            <p className="text-dark-100 text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-dark-500 text-xs capitalize">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Topbar
