import { getBadgeTierStyle } from '../../utils/helpers'
import { Lock } from 'lucide-react'

const BadgeCard = ({ badge, earned = false, index = 0 }) => {
  const style = getBadgeTierStyle(badge.tier)

  return (
    <div
      className={`relative p-3 rounded-lg border transition-colors ${earned ? `${style.bg} ${style.border}` : 'bg-dark-800 border-dark-700 opacity-50 grayscale'}`}
    >
      {!earned && (
        <div className="absolute top-2 right-2">
          <Lock size={12} className="text-dark-500" />
        </div>
      )}

      <div className="text-center">
        <div className={`text-3xl mb-1.5 ${earned ? '' : 'filter grayscale'}`}>{badge.icon}</div>
        <h3 className={`text-sm font-semibold ${earned ? style.text : 'text-dark-500'} mb-0.5`}>{badge.name}</h3>
        <p className="text-dark-500 text-xs mb-1.5">{badge.description}</p>
        
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
          {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
        </div>

        {earned && (
          <div className="mt-1.5 flex justify-center gap-2 text-xs text-dark-400">
            <span>+{badge.xpReward} XP</span>
            <span>+{badge.pointsReward} pts</span>
          </div>
        )}

        {!earned && (
          <div className="mt-1.5 text-xs text-dark-500">
            {badge.criteria?.type}: {badge.criteria?.threshold}
          </div>
        )}
      </div>
    </div>
  )
}

export default BadgeCard
