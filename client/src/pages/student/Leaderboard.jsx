import { useState, useEffect } from 'react'
import { Trophy, RefreshCw } from 'lucide-react'
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
    <div className="space-y-5 animate-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark-100 flex items-center gap-2"><Trophy size={20} className="text-primary-400" />Leaderboard</h1>
          <p className="text-dark-400 text-sm mt-0.5">Top learners this week</p>
        </div>
        <button onClick={fetchLeaderboard} className="btn-secondary py-2 px-3 text-sm"><RefreshCw size={14} /></button>
      </div>

      {/* Top 3 podium */}
      {!loading && top3.length === 3 && (
        <div className="card">
          <div className="flex items-end justify-center gap-6 py-4">
            {/* Rank 2 */}
            <div className="text-center">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[1].name)}&background=94a3b8&color=fff&bold=true`} alt="" className="w-12 h-12 rounded-full border-2 border-dark-600 mx-auto mb-1" />
              <div className="w-6 h-6 rounded-full bg-dark-700 text-dark-300 flex items-center justify-center text-xs font-bold mx-auto mb-1">2</div>
              <p className="text-dark-300 text-xs font-medium truncate w-16">{top3[1].name}</p>
              <p className="text-dark-500 text-xs">{top3[1].xp?.toLocaleString()} XP</p>
            </div>

            {/* Rank 1 */}
            <div className="text-center mb-3">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[0].name)}&background=6366f1&color=fff&bold=true`} alt="" className="w-16 h-16 rounded-full border-2 border-primary-500 mx-auto mb-1" />
              <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1">1</div>
              <p className="text-dark-100 text-sm font-semibold truncate w-20">{top3[0].name}</p>
              <p className="text-primary-400 text-xs font-medium">{top3[0].xp?.toLocaleString()} XP</p>
            </div>

            {/* Rank 3 */}
            <div className="text-center">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(top3[2].name)}&background=cd7c3a&color=fff&bold=true`} alt="" className="w-12 h-12 rounded-full border-2 border-orange-400 mx-auto mb-1" />
              <div className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1">3</div>
              <p className="text-dark-300 text-xs font-medium truncate w-16">{top3[2].name}</p>
              <p className="text-dark-500 text-xs">{top3[2].xp?.toLocaleString()} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Your rank banner */}
      {myRank && (
        <div className="bg-primary-950/50 border border-primary-800/40 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-dark-300 text-sm">Your rank</span>
          <span className="text-primary-600 font-bold text-lg">#{myRank}</span>
        </div>
      )}

      {/* Full list */}
      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-dark-900 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-1.5">
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
