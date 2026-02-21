import { motion } from 'framer-motion'
import { getBadgeTierStyle } from '../../utils/helpers'
import { Lock } from 'lucide-react'

const BadgeCard = ({ badge, earned = false, index = 0 }) => {
  const style = getBadgeTierStyle(badge.tier)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring' }}
      className={`relative p-4 rounded-2xl border transition-all duration-300 ${earned ? `${style.bg} ${style.border} shadow-lg shadow-${style.glow}` : 'bg-dark-800/30 border-dark-700/50 opacity-50 grayscale'}`}
    >
      {!earned && (
        <div className="absolute top-3 right-3">
          <Lock size={14} className="text-dark-500" />
        </div>
      )}

      <div className="text-center">
        <div className={`text-4xl mb-2 ${earned ? '' : 'filter grayscale'}`}>{badge.icon}</div>
        <h3 className={`text-sm font-bold ${earned ? style.text : 'text-dark-500'} mb-1`}>{badge.name}</h3>
        <p className="text-dark-500 text-xs mb-2">{badge.description}</p>
        
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
          {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
        </div>

        {earned && (
          <div className="mt-2 flex justify-center gap-3 text-xs text-dark-400">
            <span>⚡ +{badge.xpReward}</span>
            <span>🪙 +{badge.pointsReward}</span>
          </div>
        )}

        {!earned && (
          <div className="mt-2 text-xs text-dark-600">
            {badge.criteria?.type}: {badge.criteria?.threshold}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BadgeCard
