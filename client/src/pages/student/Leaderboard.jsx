import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, RefreshCw } from 'lucide-react'
import LeaderboardCard from '../../components/gamification/LeaderboardCard'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { getSocket } from '../../services/socket'

const Leaderboard = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/leaderboard?limit=20')
      setLeaderboard(data.leaderboard || [])
      setMyRank(data.myRank)
    } catch (_) {} finally { setLoading(false) }
  }

  useEffect(() => {
    fetchLeaderboard()
    const socket = getSocket()
    if (socket) {
      socket.on('leaderboard:update', fetchLeaderboard)
      return () => socket.off('leaderboard:update', fetchLeaderboard)
    }
  }, [])

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="space-y-6 animate-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Trophy className="text-yellow-400" />Leaderboard</h1>
          <p className="text-dark-400 mt-1">Top learners this week</p>
        </div>
        <button onClick={fetchLeaderboard} className="btn-secondary py-2 px-3 text-sm"><RefreshCw size={14} /></button>
      </div>

      {/* Top 3 podium */}
      {!loading && top3.length === 3 && (
        <div className="card">
          <div className="flex items-end justify-center gap-4 py-4">
            {/* Rank 2 */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[1].name)}&background=94a3b8&color=fff&bold=true`} alt="" className="w-14 h-14 rounded-full border-4 border-slate-400 mx-auto mb-2" />
              <div className="text-3xl mb-1">🥈</div>
              <p className="text-dark-300 text-xs font-medium truncate w-16">{top3[1].name}</p>
              <p className="text-slate-400 text-xs">{top3[1].xp?.toLocaleString()} XP</p>
            </motion.div>

            {/* Rank 1 */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="text-center mb-4">
              <div className="relative">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[0].name)}&background=6366f1&color=fff&bold=true`} alt="" className="w-18 h-18 w-20 h-20 rounded-full border-4 border-yellow-400 mx-auto mb-2 shadow-glow" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</div>
              </div>
              <div className="text-3xl mb-1">🥇</div>
              <p className="text-white text-sm font-bold truncate w-20">{top3[0].name}</p>
              <p className="text-yellow-400 text-xs font-bold">{top3[0].xp?.toLocaleString()} XP</p>
            </motion.div>

            {/* Rank 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[2].name)}&background=cd7c3a&color=fff&bold=true`} alt="" className="w-14 h-14 rounded-full border-4 border-orange-500 mx-auto mb-2" />
              <div className="text-3xl mb-1">🥉</div>
              <p className="text-dark-300 text-xs font-medium truncate w-16">{top3[2].name}</p>
              <p className="text-orange-400 text-xs">{top3[2].xp?.toLocaleString()} XP</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Your rank banner */}
      {myRank && (
        <div className="bg-primary-900/30 border border-primary-700/40 rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-dark-300 text-sm">Your current rank</span>
          <span className="text-primary-400 font-black text-xl">#{myRank}</span>
        </div>
      )}

      {/* Full list */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-dark-800 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <LeaderboardCard key={entry._id} entry={entry} index={i} isCurrentUser={user?._id === entry._id?.toString()} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
