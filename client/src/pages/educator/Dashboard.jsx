import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, TrendingUp, Star, PlusCircle, BarChart2 } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-primary-400' }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-dark-800 ${color}`}><Icon className="w-5 h-5" /></div>
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-dark-400 text-sm">{label}</p>
      {sub && <p className="text-xs text-dark-500">{sub}</p>}
    </div>
  </div>
)

const EducatorDashboard = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/educator').then(({ data }) => setAnalytics(data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const chartData = {
    labels: analytics?.courseStats?.map(c => c.title?.slice(0, 15) + '...') || [],
    datasets: [
      { label: 'Enrollments', data: analytics?.courseStats?.map(c => c.enrollments) || [], backgroundColor: '#6366f1', borderRadius: 8 },
      { label: 'Completions', data: analytics?.courseStats?.map(c => c.completions) || [], backgroundColor: '#10b981', borderRadius: 8 },
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } }, tooltip: { mode: 'index' } },
    scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } } }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Educator Dashboard</h1>
          <p className="text-dark-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Link to="/educator/courses/new" className="btn-primary flex items-center gap-2 text-sm"><PlusCircle className="w-4 h-4" />New Course</Link>
          <Link to="/educator/insights" className="btn-secondary flex items-center gap-2 text-sm"><BarChart2 className="w-4 h-4" />Insights</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="My Courses" value={loading ? '...' : analytics?.totalCourses ?? 0} color="text-primary-400" />
        <StatCard icon={Users} label="Total Students" value={loading ? '...' : analytics?.totalStudents ?? 0} color="text-green-400" />
        <StatCard icon={Star} label="Avg Rating" value={loading ? '...' : analytics?.avgRating?.toFixed(1) ?? '—'} color="text-yellow-400" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={loading ? '...' : `${analytics?.completionRate?.toFixed(0) ?? 0}%`} color="text-pink-400" />
      </div>

      {/* Course Performance Chart */}
      <div className="card p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary-400" />Course Performance</h2>
        {!loading && analytics?.courseStats?.length > 0 ? (
          <Bar data={chartData} options={chartOptions} height={120} />
        ) : (
          <div className="h-40 flex items-center justify-center text-dark-500">
            {loading ? 'Loading...' : 'No course data yet.'}
          </div>
        )}
      </div>

      {/* Recent Course List */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Your Courses</h2>
          <Link to="/educator/courses" className="text-primary-400 text-sm hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-14 bg-dark-800 rounded-xl animate-pulse" />) :
            analytics?.courseStats?.slice(0, 5).map(course => (
              <div key={course._id} className="flex items-center justify-between p-3 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-600/20 flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-400" /></div>
                  <div>
                    <p className="text-white text-sm font-medium">{course.title}</p>
                    <p className="text-dark-400 text-xs">{course.enrollments} students · {course.completions} completions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span className="text-sm font-medium">{course.rating?.toFixed(1) || '—'}</span>
                </div>
              </div>
            ))}
          {!loading && !analytics?.courseStats?.length && (
            <div className="text-center py-8 text-dark-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No courses yet. <Link to="/educator/courses/new" className="text-primary-400 hover:underline">Create one!</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EducatorDashboard
