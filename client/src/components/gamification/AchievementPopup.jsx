import { X } from 'lucide-react'
import { getBadgeTierStyle } from '../../utils/helpers'

const AchievementPopup = ({ badge, onClose }) => {
  const style = getBadgeTierStyle(badge?.tier || 'bronze')

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 animate-in">
      <div className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-lg`}>
        <button onClick={onClose} className="absolute top-2 right-2 text-dark-500 hover:text-gray-300 transition-colors">
          <X size={14} />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-2 inline-block">{badge?.icon || '🏆'}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Achievement Unlocked</div>
          <h3 className={`text-base font-semibold ${style.text} mb-1`}>{badge?.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{badge?.description}</p>
          <div className="flex items-center justify-center gap-3 text-xs">
            <span className="text-indigo-600">+{badge?.xpReward} XP</span>
            <span className="text-amber-500">+{badge?.pointsReward} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementPopup
