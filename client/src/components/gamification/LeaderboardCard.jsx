import { getRankMedal, getRankColor, getAvatarUrl, getLevelTitle } from '../../utils/helpers'
import { Zap, Flame } from 'lucide-react'

const LeaderboardCard = ({ entry, index, isCurrentUser }) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isCurrentUser ? 'border-primary-700/50 bg-primary-900/15' : 'border-dark-700 bg-dark-800'}`}
    >
      {/* Rank */}
      <div className={`text-sm font-bold w-8 text-center ${getRankColor(entry.rank)}`}>
        {getRankMedal(entry.rank)}
      </div>

      {/* Avatar + name */}
      <img
        src={entry.avatar || getAvatarUrl(entry.name)}
        alt={entry.name}
        className="w-9 h-9 rounded-full border border-dark-700 object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-dark-100 font-medium text-sm truncate">{entry.name}</p>
          {isCurrentUser && <span className="text-xs bg-primary-900/20 text-primary-400 px-1.5 py-0.5 rounded border border-primary-700/40">You</span>}
        </div>
        <p className="text-dark-500 text-xs">Lv.{entry.level} · {getLevelTitle(entry.level)}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-dark-400">
        <span className="flex items-center gap-1"><Flame size={11} className="text-orange-400" />{entry.streak}d</span>
        <span>{entry.badgeCount} badges</span>
      </div>

      {/* XP */}
      <div className="text-right shrink-0">
        <p className="text-primary-400 font-semibold text-sm flex items-center gap-1">
          <Zap size={11} /> {entry.xp?.toLocaleString()}
        </p>
        <p className="text-dark-500 text-xs">{entry.points?.toLocaleString()} pts</p>
      </div>
    </div>
  )
}

export default LeaderboardCard
