import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Flame, Trophy, BookOpen, Star, TrendingUp, ArrowRight, Award, Target } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { xpToNextLevel, getLevelTitle, formatNumber } from '../../utils/helpers'
import api from '../../services/api'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const StatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-dark-400 text-xs font-medium">{label}</p>
      <p className="text-white font-black text-2xl">{value}</p>
      {sub && <p className="text-dark-500 text-xs">{sub}</p>}
    </div>
  </motion.div>
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#334155' }, ticks: { color: '#64748b' } },
    y: { grid: { color: '#334155' }, ticks: { color: '#64748b' } },
  },
}

const StudentDashboard = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentLevel, xpInCurrentLevel, xpNeeded, progress } = xpToNextLevel(user?.xp || 0)

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, recsRes] = await Promise.all([
          api.get('/analytics/student'),
          api.get('/courses/recommendations'),
        ])
        setAnalytics(analyticsRes.data)
        setRecommendations(recsRes.data.recommendations || [])
      } catch (_) {} finally { setLoading(false) }
    }
    load()
  }, [])

  const weeklyChartData = {
    labels: analytics?.weeklyData?.map(d => d.date) || [],
    datasets: [{
      label: 'XP Earned',
      data: analytics?.weeklyData?.map(d => d.xp) || [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#6366f1',
    }],
  }

  const categoryData = {
    labels: analytics?.categoryPerformance?.map(c => c.category) || [],
    datasets: [{
      label: 'Avg Score %',
      data: analytics?.categoryPerformance?.map(c => c.avgScore) || [],
      backgroundColor: ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'],
      borderRadius: 6,
    }],
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 🎮
          </h1>
          <p className="text-dark-400 mt-1">Level {currentLevel} · {getLevelTitle(currentLevel)} · Keep going!</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-xl">
          <Flame size={16} className="animate-flame" />
          <span className="font-bold">{user?.streak} day streak</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="card bg-gradient-to-r from-primary-900/40 to-purple-900/30 border-primary-700/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary-400" />
            <span className="text-white font-bold">Level {currentLevel}</span>
            <span className="text-dark-400 text-sm">→</span>
            <span className="text-dark-400 text-sm">Level {currentLevel + 1}</span>
          </div>
          <span className="text-primary-400 font-semibold text-sm">{xpInCurrentLevel}/{xpNeeded} XP</span>
        </div>
        <div className="progress-bar h-4">
          <motion.div className="xp-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
        <div className="flex justify-between text-xs text-dark-500 mt-1.5">
          <span>{formatNumber(user?.xp)} total XP</span>
          <span>{xpNeeded - xpInCurrentLevel} XP to next level</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Total XP" value={formatNumber(user?.xp || 0)} color="bg-primary-600" delay={0.1} />
        <StatCard icon={BookOpen} label="Courses Enrolled" value={analytics?.stats?.enrolledCourses || 0} sub={`${analytics?.stats?.completedCourses || 0} completed`} color="bg-blue-600" delay={0.15} />
        <StatCard icon={Target} label="Quizzes Passed" value={analytics?.stats?.passedQuizzes || 0} sub={`${analytics?.stats?.avgScore || 0}% avg score`} color="bg-emerald-600" delay={0.2} />
        <StatCard icon={Award} label="Badges Earned" value={analytics?.stats?.badges?.length || 0} sub="Keep collecting!" color="bg-yellow-600" delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly XP Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2"><TrendingUp size={18} className="text-primary-400" />Weekly XP Progress</h2>
          </div>
          <div className="h-48">
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Streak & Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Flame size={18} className="text-orange-400" />Streak Stats</h2>
          <div className="space-y-4">
            <div className="text-center py-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <div className="text-5xl font-black text-orange-400 animate-flame inline-block">🔥</div>
              <p className="text-white font-black text-3xl mt-1">{user?.streak}</p>
              <p className="text-dark-400 text-sm">day streak</p>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-center">
                <p className="text-white font-bold">{user?.longestStreak || 0}</p>
                <p className="text-dark-500 text-xs">Best Streak</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{analytics?.stats?.completedLessons || 0}</p>
                <p className="text-dark-500 text-xs">Lessons Done</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{analytics?.stats?.totalAttempts || 0}</p>
                <p className="text-dark-500 text-xs">Quiz Attempts</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Performance */}
      {analytics?.categoryPerformance?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Star size={18} className="text-yellow-400" />Performance by Category</h2>
          <div className="h-48">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </motion.div>
      )}

      {/* Recent Badges */}
      {analytics?.stats?.badges?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Award size={18} className="text-yellow-400" />Recent Badges</h2>
            <Link to="/student/badges" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="flex gap-3 flex-wrap">
            {analytics.stats.badges.slice(-6).map(badge => (
              <div key={badge._id} title={badge.name} className="w-12 h-12 flex items-center justify-center bg-dark-700 rounded-xl border border-dark-600 text-2xl hover:scale-110 transition-transform cursor-pointer">
                {badge.icon}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended Courses */}
      {recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2">🤖 AI Recommended for You</h2>
            <Link to="/student/courses" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">Browse all <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((course, i) => (
              <Link key={course._id} to={`/student/courses/${course._id}`}
                className="card-hover group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors truncate">{course.title}</h3>
                    <p className="text-dark-500 text-xs">{course.category} · {course.difficulty}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-primary-400 text-xs flex items-center gap-1"><Zap size={10} />+{course.xpReward} XP</span>
                      <span className="text-yellow-400 text-xs flex items-center gap-1"><Star size={10} />{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default StudentDashboard
