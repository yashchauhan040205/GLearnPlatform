import { motion } from 'framer-motion'
import { getRankMedal, getRankColor, getAvatarUrl, getLevelTitle } from '../../utils/helpers'
import { Zap, Flame } from 'lucide-react'

const LeaderboardCard = ({ entry, index, isCurrentUser }) => {
  const rankClass = entry.rank === 1 ? 'rank-1' : entry.rank === 2 ? 'rank-2' : entry.rank === 3 ? 'rank-3' : ''

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${rankClass} ${isCurrentUser ? 'border-primary-500/50 bg-primary-500/5 shadow-glow-sm' : 'border-dark-700 bg-dark-800/50'}`}
    >
      {/* Rank */}
      <div className={`text-xl font-black w-10 text-center ${getRankColor(entry.rank)}`}>
        {getRankMedal(entry.rank)}
      </div>

      {/* Avatar + name */}
      <img
        src={entry.avatar || getAvatarUrl(entry.name)}
        alt={entry.name}
        className="w-10 h-10 rounded-full border-2 border-dark-600 object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-semibold text-sm truncate">{entry.name}</p>
          {isCurrentUser && <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/30">You</span>}
        </div>
        <p className="text-dark-500 text-xs">Lv.{entry.level} · {getLevelTitle(entry.level)}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-dark-400">
        <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" />{entry.streak}d</span>
        <span className="text-dark-600">|</span>
        <span>{entry.badgeCount} badges</span>
      </div>

      {/* XP */}
      <div className="text-right shrink-0">
        <p className="text-primary-400 font-bold text-sm flex items-center gap-1">
          <Zap size={12} /> {entry.xp?.toLocaleString()}
        </p>
        <p className="text-dark-500 text-xs">{entry.points?.toLocaleString()} pts</p>
      </div>
    </motion.div>
  )
}

export default LeaderboardCard
