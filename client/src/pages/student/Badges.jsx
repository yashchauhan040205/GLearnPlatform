import { useState, useEffect } from 'react'
import { Award } from 'lucide-react'
import BadgeCard from '../../components/gamification/BadgeCard'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const Badges = () => {
  const { user } = useAuth()
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/badges').then(({ data }) => setBadges(data.badges || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const earned = badges.filter(b => b.earned)
  const unearned = badges.filter(b => !b.earned)
  const filtered = filter === 'all' ? badges : filter === 'earned' ? earned : unearned

  return (
    <div className="space-y-5 animate-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2"><Award size={20} className="text-amber-500" />Badges</h1>
          <p className="text-gray-400 text-sm mt-0.5">{earned.length} of {badges.length} earned</p>
        </div>
        <div className="text-center">
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3f3f46" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#5c7cfa" strokeWidth="3"
                strokeDasharray={`${badges.length > 0 ? (earned.length / badges.length) * 100 : 0} 100`}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-100 font-semibold text-xs">{badges.length > 0 ? Math.round((earned.length / badges.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[{ key: 'all', label: `All (${badges.length})` }, { key: 'earned', label: `Earned (${earned.length})` }, { key: 'locked', label: `Locked (${unearned.length})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === key ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-gray-100 border border-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tiers */}
      {['diamond', 'platinum', 'gold', 'silver', 'bronze'].map(tier => {
        const tierBadges = filtered.filter(b => b.tier === tier)
        if (!tierBadges.length) return null
        return (
          <div key={tier}>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              {tier}
              <span className="text-dark-500">({tierBadges.filter(b => b.earned).length}/{tierBadges.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {tierBadges.map((badge, i) => (
                <BadgeCard key={badge._id} badge={badge} earned={badge.earned} index={i} />
              ))}
            </div>
          </div>
        )
      })}

      {loading && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[...Array(8)].map((_, i) => <div key={i} className="h-40 bg-gray-900 rounded-lg animate-pulse" />)}</div>}
    </div>
  )
}

export default Badges
