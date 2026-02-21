import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { getBadgeTierStyle } from '../../utils/helpers'

const AchievementPopup = ({ badge, onClose }) => {
  const style = getBadgeTierStyle(badge?.tier || 'bronze')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 w-80"
      >
        <div className={`${style.bg} border ${style.border} rounded-2xl p-5 shadow-2xl backdrop-blur-md`}>
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: ['#6366f1','#f59e0b','#10b981','#ec4899','#3b82f6'][i % 5], left: `${10 + i * 12}%`, top: '20%' }}
                animate={{ y: [0, -40, 60], opacity: [1, 1, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 1.5, delay: i * 0.08, ease: 'easeOut' }}
              />
            ))}
          </div>

          <button onClick={onClose} className="absolute top-3 right-3 text-dark-500 hover:text-dark-300 transition-colors">
            <X size={16} />
          </button>

          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-5xl mb-3 inline-block"
            >
              {badge?.icon || '🏆'}
            </motion.div>
            <div className="text-xs font-bold uppercase tracking-widest text-dark-400 mb-1">Achievement Unlocked!</div>
            <h3 className={`text-lg font-bold ${style.text} mb-1`}>{badge?.name}</h3>
            <p className="text-dark-400 text-sm mb-3">{badge?.description}</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-primary-400">⚡ +{badge?.xpReward} XP</span>
              <span className="flex items-center gap-1 text-yellow-400">🪙 +{badge?.pointsReward} pts</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AchievementPopup
