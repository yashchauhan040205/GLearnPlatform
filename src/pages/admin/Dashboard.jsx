import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, Award, TrendingUp, Shield, Activity, Globe } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Tooltip, Legend)

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-primary-400', bg = 'bg-primary-600/10' }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-dark-400 text-sm mt-1">{label}</p>
    {sub && <p className="text-xs text-dark-500 mt-0.5">{sub}</p>}
  </div>
)

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/admin').then(({ data }) => setAnalytics(data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const roleChart = {
    labels: ['Students', 'Educators', 'Admins'],
    datasets: [{
      data: [analytics?.roleBreakdown?.student || 0, analytics?.roleBreakdown?.educator || 0, analytics?.roleBreakdown?.admin || 0],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderColor: '#0f172a',
      borderWidth: 3,
    }]
  }

  const growthChart = {
    labels: analytics?.growthData?.map(g => g.month) || [],
    datasets: [
      { label: 'New Users', data: analytics?.growthData?.map(g => g.users) || [], borderColor: '#6366f1', backgroundColor: '#6366f120', tension: 0.4, fill: true },
      { label: 'New Courses', data: analytics?.growthData?.map(g => g.courses) || [], borderColor: '#10b981', backgroundColor: '#10b98120', tension: 0.4, fill: true },
    ]
  }

  const chartOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } } }
  }

  const stats = [
    { icon: Users, label: 'Total Users', value: loading ? '...' : analytics?.totalUsers?.toLocaleString() ?? 0, color: 'text-primary-400', bg: 'bg-primary-600/10' },
    { icon: BookOpen, label: 'Total Courses', value: loading ? '...' : analytics?.totalCourses ?? 0, color: 'text-green-400', bg: 'bg-green-600/10' },
    { icon: Activity, label: 'Total Attempts', value: loading ? '...' : analytics?.totalAttempts?.toLocaleString() ?? 0, color: 'text-yellow-400', bg: 'bg-yellow-600/10' },
    { icon: Award, label: 'Badges Awarded', value: loading ? '...' : analytics?.totalBadgesAwarded?.toLocaleString() ?? 0, color: 'text-pink-400', bg: 'bg-pink-600/10' },
    { icon: TrendingUp, label: 'Avg Completion', value: loading ? '...' : `${analytics?.avgCompletion?.toFixed(0) ?? 0}%`, color: 'text-cyan-400', bg: 'bg-cyan-600/10' },
    { icon: Globe, label: 'Published Courses', value: loading ? '...' : analytics?.publishedCourses ?? 0, color: 'text-orange-400', bg: 'bg-orange-600/10' },
  ]

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Shield className="text-primary-400" />Admin Dashboard</h1>
          <p className="text-dark-400 mt-1">Platform-wide overview</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/users" className="btn-secondary text-sm flex items-center gap-2"><Users className="w-4 h-4" />Manage Users</Link>
          <Link to="/admin/courses" className="btn-secondary text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" />Manage Courses</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Chart (2 cols) */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-white font-bold mb-4">Platform Growth</h2>
          {!loading && analytics?.growthData?.length ? (
            <Line data={growthChart} options={chartOpts} height={120} />
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No growth data'}</div>
          )}
        </div>

        {/* Role Breakdown */}
        <div className="card p-5">
          <h2 className="text-white font-bold mb-4">User Roles</h2>
          {!loading && analytics?.roleBreakdown ? (
            <div>
              <Doughnut data={roleChart} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } }, cutout: '70%' }} />
              <div className="space-y-1 mt-4">
                {[['Students', analytics.roleBreakdown.student, '#6366f1'], ['Educators', analytics.roleBreakdown.educator, '#10b981'], ['Admins', analytics.roleBreakdown.admin, '#f59e0b']].map(([label, val, color]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-dark-400"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />{label}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No data'}</div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Recent Users</h2>
          <Link to="/admin/users" className="text-primary-400 text-sm hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-12 bg-dark-800 rounded-xl animate-pulse" />) :
            analytics?.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{u.name?.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{u.name}</p>
                  <p className="text-dark-500 text-xs">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${u.role === 'admin' ? 'bg-red-600/20 text-red-400' : u.role === 'educator' ? 'bg-green-600/20 text-green-400' : 'bg-primary-600/20 text-primary-400'}`}>{u.role}</span>
              </div>
            ))}
          {!loading && !analytics?.recentUsers?.length && <p className="text-dark-500 text-center py-4">No users found.</p>}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
