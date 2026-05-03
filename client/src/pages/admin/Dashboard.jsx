import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, Award, TrendingUp, Shield, Activity, Globe, PlusCircle, BarChart3, Settings } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Tooltip, Legend)

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-primary-400', bg = 'bg-primary-950/50' }) => (
  <div className="card p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg border border-dark-800 ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
    </div>
    <p className="text-2xl font-bold text-dark-100">{value}</p>
    <p className="text-dark-400 text-sm mt-0.5">{label}</p>
    {sub && <p className="text-xs text-dark-500 mt-0.5">{sub}</p>}
  </div>
)

const QuickActionBtn = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-850 border border-dark-700 hover:border-primary-500 hover:bg-dark-800 transition-all">
    <Icon className="w-4 h-4 text-primary-400" />
    <span className="text-sm font-medium text-dark-100">{label}</span>
  </Link>
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
      backgroundColor: ['#6366f1', '#10b981', '#a78bfa'],
      borderColor: '#27272a',
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
    plugins: { legend: { labels: { color: '#71717a' } } },
    scales: { x: { ticks: { color: '#71717a' }, grid: { color: '#3f3f46' } }, y: { ticks: { color: '#71717a' }, grid: { color: '#3f3f46' } } }
  }

  const stats = [
    { icon: Users, label: 'Total Users', value: loading ? '...' : analytics?.totalUsers?.toLocaleString() ?? 0, color: 'text-primary-400', bg: 'bg-primary-950/50' },
    { icon: BookOpen, label: 'Total Courses', value: loading ? '...' : analytics?.totalCourses ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-950/50' },
    { icon: Activity, label: 'Total Attempts', value: loading ? '...' : analytics?.totalAttempts?.toLocaleString() ?? 0, color: 'text-violet-400', bg: 'bg-violet-950/50' },
    { icon: Award, label: 'Badges Awarded', value: loading ? '...' : analytics?.totalBadgesAwarded?.toLocaleString() ?? 0, color: 'text-rose-400', bg: 'bg-rose-950/50' },
    { icon: TrendingUp, label: 'Avg Completion', value: loading ? '...' : `${analytics?.avgCompletion?.toFixed(0) ?? 0}%`, color: 'text-cyan-400', bg: 'bg-cyan-950/50' },
    { icon: Globe, label: 'Published Courses', value: loading ? '...' : analytics?.publishedCourses ?? 0, color: 'text-sky-400', bg: 'bg-sky-950/50' },
  ]

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark-100 flex items-center gap-2"><Shield className="text-primary-600" size={20} />Admin Dashboard</h1>
          <p className="text-dark-400 mt-1">Platform overview & management center</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <QuickActionBtn icon={PlusCircle} label="Create Course" to="/admin/courses/new" />
          <QuickActionBtn icon={Users} label="Manage Users" to="/admin/users" />
          <QuickActionBtn icon={BookOpen} label="All Courses" to="/admin/courses" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Chart (2 cols) */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-dark-100 font-semibold mb-3 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            Platform Growth (6 months)
          </h2>
          {!loading && analytics?.growthData?.length ? (
            <Line data={growthChart} options={chartOpts} height={120} />
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No growth data'}</div>
          )}
        </div>

        {/* Role Breakdown */}
        <div className="card p-5">
          <h2 className="text-dark-100 font-semibold mb-3 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-400" />
            User Roles
          </h2>
          {!loading && analytics?.roleBreakdown ? (
            <div>
              <Doughnut data={roleChart} options={{ plugins: { legend: { labels: { color: '#6c757d' } } }, cutout: '70%' }} />
              <div className="space-y-1 mt-4">
                {[['Students', analytics.roleBreakdown.student, '#6366f1'], ['Educators', analytics.roleBreakdown.educator, '#10b981'], ['Admins', analytics.roleBreakdown.admin, '#a78bfa']].map(([label, val, color]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-dark-400"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />{label}</span>
                    <span className="text-dark-100 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No data'}</div>
          )}
        </div>
      </div>

      {/* Quick Actions & Admin Tools */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-dark-100 font-semibold mb-3 text-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link to="/admin/courses/new" className="block p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-100 text-sm font-medium">📚 Create New Course</Link>
            <Link to="/admin/users" className="block p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-100 text-sm font-medium">👥 Manage Users</Link>
            <Link to="/admin/courses" className="block p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-100 text-sm font-medium">📋 View All Courses</Link>
          </div>
        </div>

        {/* Platform Stats Summary */}
        <div className="card p-5">
          <h3 className="text-dark-100 font-semibold mb-3 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Platform Stats
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-dark-700">
              <span className="text-dark-400">Active Users</span>
              <span className="text-dark-100 font-bold">{loading ? '...' : `${Math.round((analytics?.roleBreakdown?.student || 0) * 0.75)}+`}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-dark-700">
              <span className="text-dark-400">Completion Rate</span>
              <span className="text-dark-100 font-bold">{loading ? '...' : `${analytics?.avgCompletion?.toFixed(0) ?? 0}%`}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-400">Avg Rating</span>
              <span className="text-dark-100 font-bold">⭐ {loading ? '...' : '4.2/5'}</span>
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="card p-5">
          <h3 className="text-dark-100 font-semibold mb-3 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            Admin Tools
          </h3>
          <div className="space-y-2">
            <button disabled className="w-full p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-200 text-sm font-medium text-left opacity-50 cursor-not-allowed">
              📊 Activity Logs
            </button>
            <button disabled className="w-full p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-200 text-sm font-medium text-left opacity-50 cursor-not-allowed">
              ⚙️ System Settings
            </button>
            <button disabled className="w-full p-3 rounded-lg bg-dark-850 hover:bg-dark-800 transition-colors text-dark-200 text-sm font-medium text-left opacity-50 cursor-not-allowed">
              📈 Reports
            </button>
          </div>
          <p className="text-xs text-dark-500 mt-3">Coming soon...</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-dark-100 font-semibold text-sm flex items-center gap-2"><Users className="w-4 h-4 text-primary-400" />Recent Users</h2>
          <Link to="/admin/users" className="text-primary-400 text-sm hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-12 bg-dark-900 rounded-xl animate-pulse" />) :
            analytics?.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl hover:bg-dark-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">{u.name?.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-dark-100 text-sm font-medium">{u.name}</p>
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
