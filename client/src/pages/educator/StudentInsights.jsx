import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Users, TrendingUp, Award, BookOpen, BarChart2 } from 'lucide-react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js'
import api from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: '#94a3b8' } } },
  scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } } }
}

const StudentInsights = () => {
  const { courseId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = courseId ? `/analytics/educator?courseId=${courseId}` : '/analytics/educator'
    api.get(url).then(({ data: d }) => setData(d)).catch(() => {}).finally(() => setLoading(false))
  }, [courseId])

  const completionChart = {
    labels: data?.courseStats?.map(c => c.title?.slice(0, 12) + '...') || [],
    datasets: [
      { label: 'Enrolled', data: data?.courseStats?.map(c => c.enrollments) || [], backgroundColor: '#6366f1', borderRadius: 6 },
      { label: 'Completed', data: data?.courseStats?.map(c => c.completions) || [], backgroundColor: '#10b981', borderRadius: 6 },
    ]
  }

  const scoreChart = {
    labels: data?.quizStats?.map(q => q.title?.slice(0, 10) + '...') || [],
    datasets: [{ label: 'Avg Score %', data: data?.quizStats?.map(q => q.avgScore) || [], borderColor: '#f59e0b', backgroundColor: '#f59e0b20', tension: 0.4, fill: true, pointBackgroundColor: '#f59e0b' }]
  }

  const leaderboard = data?.topStudents || []

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2"><BarChart2 className="text-primary-400" />Student Insights</h1>
        <p className="text-dark-400 mt-1">Performance overview across your courses</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: data?.totalStudents ?? '—', color: 'text-primary-400' },
          { icon: TrendingUp, label: 'Avg Completion', value: data?.completionRate ? `${data.completionRate.toFixed(0)}%` : '—', color: 'text-green-400' },
          { icon: Award, label: 'Avg Quiz Score', value: data?.avgQuizScore ? `${data.avgQuizScore.toFixed(0)}%` : '—', color: 'text-yellow-400' },
          { icon: BookOpen, label: 'Active Courses', value: data?.totalCourses ?? '—', color: 'text-pink-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`p-3 bg-dark-800 rounded-xl ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-black text-white">{loading ? '...' : value}</p>
              <p className="text-dark-400 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Chart */}
        <div className="card p-5">
          <h2 className="text-white font-bold mb-4">Enrollment vs Completion</h2>
          {!loading && data?.courseStats?.length ? (
            <Bar data={completionChart} options={CHART_OPTS} height={180} />
          ) : (
            <div className="h-44 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No data'}</div>
          )}
        </div>

        {/* Quiz Score Chart */}
        <div className="card p-5">
          <h2 className="text-white font-bold mb-4">Average Quiz Scores</h2>
          {!loading && data?.quizStats?.length ? (
            <Line data={scoreChart} options={CHART_OPTS} height={180} />
          ) : (
            <div className="h-44 flex items-center justify-center text-dark-500">{loading ? 'Loading...' : 'No quiz data'}</div>
          )}
        </div>
      </div>

      {/* Top Students */}
      <div className="card p-5">
        <h2 className="text-white font-bold mb-4">Top Performing Students</h2>
        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-dark-800 rounded-xl animate-pulse" />)}</div>
        ) : leaderboard.length === 0 ? (
          <p className="text-dark-500 text-center py-6">No student data available.</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((student, i) => (
              <div key={student._id} className="flex items-center gap-4 p-3 bg-dark-800 rounded-xl">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-dark-700 text-dark-300'}`}>{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {student.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{student.name}</p>
                  <p className="text-dark-500 text-xs">{student.completedCourses?.length || 0} courses completed</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-bold text-sm">{student.xp?.toLocaleString()} XP</p>
                  <p className="text-dark-500 text-xs">Level {student.level}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentInsights
