// Format XP with level calculation
export const xpToNextLevel = (currentXP) => {
  const currentLevel = Math.floor(currentXP / 1000) + 1
  const xpInCurrentLevel = currentXP % 1000
  const xpNeeded = 1000
  return { currentLevel, xpInCurrentLevel, xpNeeded, progress: (xpInCurrentLevel / xpNeeded) * 100 }
}

// Format numbers
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Get level title
export const getLevelTitle = (level) => {
  if (level >= 50) return 'Legendary Scholar'
  if (level >= 30) return 'Grandmaster'
  if (level >= 20) return 'Expert'
  if (level >= 15) return 'Advanced'
  if (level >= 10) return 'Intermediate'
  if (level >= 5) return 'Apprentice'
  return 'Beginner'
}

// Get rank colors
export const getRankColor = (rank) => {
  if (rank === 1) return 'text-yellow-400'
  if (rank === 2) return 'text-slate-300'
  if (rank === 3) return 'text-orange-400'
  return 'text-dark-400'
}

// Get rank medal
export const getRankMedal = (rank) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

// Get badge tier styling
export const getBadgeTierStyle = (tier) => {
  const styles = {
    bronze: { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-700/50', glow: 'shadow-orange-500/20' },
    silver: { bg: 'bg-slate-700/30', text: 'text-slate-300', border: 'border-slate-600/50', glow: 'shadow-slate-400/20' },
    gold: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-700/50', glow: 'shadow-yellow-500/30' },
    platinum: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-700/50', glow: 'shadow-purple-500/30' },
    diamond: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700/50', glow: 'shadow-blue-500/40' },
  }
  return styles[tier] || styles.bronze
}

// Format date relative
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}

// Format duration in minutes
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
    easy: 'text-green-400 bg-green-400/10 border-green-400/30',
    intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
    hard: 'text-red-400 bg-red-400/10 border-red-400/30',
  }
  return colors[difficulty] || colors.beginner
}

// Generate avatar URL 
export const getAvatarUrl = (name, size = 40) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=6366f1&color=fff&bold=true`
}
