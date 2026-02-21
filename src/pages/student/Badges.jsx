import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <div className="space-y-6 animate-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Award className="text-yellow-400" />Badges</h1>
          <p className="text-dark-400 mt-1">{earned.length} of {badges.length} badges earned</p>
        </div>
        {/* Progress ring concept */}
        <div className="text-center">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3"
                strokeDasharray={`${badges.length > 0 ? (earned.length / badges.length) * 100 : 0} 100`}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xs">{badges.length > 0 ? Math.round((earned.length / badges.length) * 100) : 0}%</span>
            </div>
          </div>
          <p className="text-dark-500 text-xs mt-1">Complete</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[{ key: 'all', label: `All (${badges.length})` }, { key: 'earned', label: `Earned (${earned.length})` }, { key: 'locked', label: `Locked (${unearned.length})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === key ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'}`}>
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
            <h2 className="text-dark-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              {tier} tier
              <span className="text-dark-600">({tierBadges.filter(b => b.earned).length}/{tierBadges.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tierBadges.map((badge, i) => (
                <BadgeCard key={badge._id} badge={badge} earned={badge.earned} index={i} />
              ))}
            </div>
          </div>
        )
      })}

      {loading && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-44 bg-dark-800 rounded-2xl animate-pulse" />)}</div>}
    </div>
  )
}

export default Badges
