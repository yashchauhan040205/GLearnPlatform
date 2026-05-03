import { useState, useEffect } from 'react'
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

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-dark-400 text-xs">{label}</p>
      <p className="text-dark-100 font-semibold text-xl">{value}</p>
      {sub && <p className="text-dark-500 text-xs">{sub}</p>}
    </div>
  </div>
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#3f3f46' }, ticks: { color: '#71717a' } },
    y: { grid: { color: '#3f3f46' }, ticks: { color: '#71717a' } },
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
      backgroundColor: 'rgba(99,102,241,0.08)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#6366f1',
    }],
  }

  const categoryData = {
    labels: analytics?.categoryPerformance?.map(c => c.category) || [],
    datasets: [{
      label: 'Avg Score %',
      data: analytics?.categoryPerformance?.map(c => c.avgScore) || [],
      backgroundColor: ['#4c6ef5','#7950f2','#e64980','#e8890c','#2f9e44','#1c7ed6'],
      borderRadius: 4,
    }],
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5 animate-in">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark-100">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">Level {currentLevel} · {getLevelTitle(currentLevel)}</p>
        </div>
        {user?.streak > 0 && (
          <div className="flex items-center gap-1.5 bg-dark-900 border border-dark-700 text-primary-400 px-3 py-1.5 rounded-lg text-sm">
            <Flame size={14} />
            <span className="font-medium">{user?.streak} day streak</span>
          </div>
        )}
      </div>

      {/* XP Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary-400" />
            <span className="text-dark-100 font-medium text-sm">Level {currentLevel} → Level {currentLevel + 1}</span>
          </div>
          <span className="text-primary-400 font-medium text-sm">{xpInCurrentLevel}/{xpNeeded} XP</span>
        </div>
        <div className="progress-bar h-2.5">
          <div className="xp-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-dark-500 mt-1">
          <span>{formatNumber(user?.xp)} total XP</span>
          <span>{xpNeeded - xpInCurrentLevel} XP to next level</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Zap} label="Total XP" value={formatNumber(user?.xp || 0)} color="bg-primary-600" />
        <StatCard icon={BookOpen} label="Enrolled" value={analytics?.stats?.enrolledCourses || 0} sub={`${analytics?.stats?.completedCourses || 0} completed`} color="bg-blue-500" />
        <StatCard icon={Target} label="Quizzes Passed" value={analytics?.stats?.passedQuizzes || 0} sub={`${analytics?.stats?.avgScore || 0}% avg`} color="bg-emerald-500" />
        <StatCard icon={Award} label="Badges" value={analytics?.stats?.badges?.length || 0} sub="Keep collecting" color="bg-violet-600" />
      </div>

      {/* Progress Path */}
      <div className="card">
        <h2 className="text-dark-100 font-semibold text-sm mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-500" />
          How to earn XP
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-dark-950 rounded-lg p-3 border border-dark-800">
            <h3 className="text-dark-100 font-medium text-sm mb-1">Complete Chapters</h3>
            <p className="text-dark-400 text-xs mb-2">Finish chapters to earn XP</p>
            <div className="flex items-center justify-between">
              <span className="text-primary-400 text-xs font-medium">50-150 XP each</span>
                <Link to="/student/courses" className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1">
                Start <ArrowRight size={10} />
              </Link>
            </div>
          </div>
          <div className="bg-dark-950 rounded-lg p-3 border border-dark-800">
            <h3 className="text-dark-100 font-medium text-sm mb-1">Pass Quizzes</h3>
            <p className="text-dark-400 text-xs mb-2">Test your knowledge</p>
            <span className="text-primary-400 text-xs font-medium">100-200 XP each</span>
          </div>
          <div className="bg-dark-950 rounded-lg p-3 border border-dark-800">
            <h3 className="text-dark-100 font-medium text-sm mb-1">Finish Courses</h3>
            <p className="text-dark-400 text-xs mb-2">Complete all chapters for bonus</p>
            <span className="text-emerald-400 text-xs font-medium">500-3000 XP bonus</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-dark-700 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Target size={12} className="text-primary-400" />
            <span className="text-dark-400">Next Level: <span className="text-dark-100 font-medium">{xpNeeded - xpInCurrentLevel} XP</span> needed</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-dark-400">Rank <span className="text-dark-100 font-medium">#{analytics?.leaderboardRank || '—'}</span></span>
          </div>
          <Link to="/student/badges" className="flex items-center gap-1 text-primary-400 hover:text-primary-300 ml-auto">
            <Award size={12} />
            <span>{8 - (analytics?.stats?.badges?.length || 0)} badges to unlock</span>
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="text-dark-100 font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-primary-400" />Weekly XP</h2>
          <div className="h-44">
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-dark-100 font-semibold text-sm mb-3 flex items-center gap-2"><Flame size={14} className="text-orange-500" />Streak</h2>
          <div className="space-y-3">
            <div className="text-center py-3 bg-primary-950/50 rounded-lg border border-primary-800/30">
              <p className="text-primary-300 font-bold text-2xl">{user?.streak}</p>
              <p className="text-dark-400 text-xs">day streak</p>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-center">
                <p className="text-dark-100 font-semibold">{user?.longestStreak || 0}</p>
                <p className="text-dark-500 text-xs">Best</p>
              </div>
              <div className="text-center">
                <p className="text-dark-100 font-semibold">{analytics?.stats?.completedLessons || 0}</p>
                <p className="text-dark-500 text-xs">Lessons</p>
              </div>
              <div className="text-center">
                <p className="text-dark-100 font-semibold">{analytics?.stats?.totalAttempts || 0}</p>
                <p className="text-dark-500 text-xs">Quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      {analytics?.categoryPerformance?.length > 0 && (
        <div className="card">
          <h2 className="text-dark-100 font-semibold text-sm mb-3 flex items-center gap-2"><Star size={14} className="text-primary-400" />Performance by Category</h2>
          <div className="h-44">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Badges */}
      {analytics?.stats?.badges?.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-dark-100 font-semibold text-sm flex items-center gap-2"><Award size={14} className="text-primary-400" />Recent Badges</h2>
            <Link to="/student/badges" className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            {analytics.stats.badges.slice(-6).map(badge => (
              <div className="w-10 h-10 flex items-center justify-center bg-dark-950 rounded-lg border border-dark-800 text-xl hover:scale-105 transition-transform cursor-pointer">
                {badge.icon}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-dark-100 font-semibold text-sm">Recommended for You</h2>
            <Link to="/student/courses" className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1">Browse all <ArrowRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.slice(0, 3).map((course) => (
              <Link key={course._id} to={`/student/courses/${course._id}`}
                className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-950/50 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen size={14} className="text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-dark-100 font-medium text-sm truncate">{course.title}</h3>
                    <p className="text-dark-500 text-xs">{course.category} · {course.difficulty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary-400 text-xs flex items-center gap-0.5"><Zap size={10} />+{course.xpReward} XP</span>
                      <span className="text-amber-500 text-xs flex items-center gap-0.5"><Star size={10} />{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard