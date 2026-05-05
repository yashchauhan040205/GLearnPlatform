import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BookOpen, ArrowRight, Award, TrendingUp, Zap, BarChart2, MessageSquare, Flame, ShieldCheck, Users, Star, Loader, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: Zap,           title: 'XP & Levelling',     desc: 'Every lesson and quiz earns experience points. Your level rises as your knowledge deepens.' },
  { icon: Award,         title: 'Achievement Badges',  desc: 'Unlock curated badges that reflect your expertise and consistency across subjects.' },
  { icon: TrendingUp,    title: 'Global Leaderboard',  desc: 'Compete with fellow learners worldwide and track your climb to the top.' },
  { icon: Flame,         title: 'Daily Streaks',        desc: 'Build a learning habit. Streak shields protect you on the days life gets busy.' },
  { icon: BarChart2,     title: 'Progress Analytics',  desc: 'Detailed dashboards showing quiz scores, completion rates, and XP over time.' },
  { icon: MessageSquare, title: 'Course Discussions',  desc: 'Ask questions and collaborate with peers directly inside every course.' },
]

const steps = [
  { num: '01', title: 'Create an account',   desc: 'Register as a Student or Educator in under a minute. No credit card needed.' },
  { num: '02', title: 'Enroll in a course',  desc: 'Browse the library and enroll with a single click to begin immediately.' },
  { num: '03', title: 'Learn & earn rewards', desc: 'Complete lessons, pass quizzes, collect XP and badges, and rise up the leaderboard.' },
]

const StatCounter = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const increment = value / 30
    const interval = setInterval(() => {
      setCount(prev => Math.min(prev + increment, value))
    }, 50)
    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="text-center animate-fadeIn">
      <div className="text-4xl font-bold text-indigo-400 mb-2">
        {Math.floor(count).toLocaleString()}{suffix}
      </div>
      <p className="text-sm text-gray-400 font-medium">{label}</p>
    </div>
  )
}

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [topCourses, setTopCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public/stats')
        const data = await response.json()
        setStats(data.stats)
        setTopCourses(data.topCourses)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleStart = () => {
    if (user) navigate(`/${user.role}`)
    else navigate('/register')
  }

  return (
    <div className="landing-bg">
      {/* subtle grid overlay */}
      <div className="landing-grid-overlay" />

      {/* ── Navbar ── */}
      <nav className="relative z-10 sticky top-0 border-b border-emerald-100 bg-white/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 shadow-sm shadow-emerald-200">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">GLearnPlatform</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm px-4 py-2 rounded-lg font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-200"
            >
              Sign up <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center">
        <div className="landing-hero-glow" />

        <div className="relative">
          <div className="landing-hero-chip">
            <CheckCircle size={14} /> Trusted by 10K+ learners worldwide
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.2] mb-6 tracking-tight text-slate-900">
            Master <span className="text-emerald-600">skills that matter</span><br />
            for your future
          </h1>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto text-slate-600">
            Learn with interactive courses, track real progress, earn XP points and badges, and compete globally. Your learning journey starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStart}
              className="px-8 py-3 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200 hover:shadow-md"
            >
              Start Free Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base border-2 border-emerald-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors bg-white/70"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Platform Stats ── */}
      <section className="relative z-10 py-16 px-5 sm:px-8 border-y border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {loading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : stats ? (
              <>
                <StatCounter value={stats.totalUsers} label="Active Learners" suffix="+" />
                <StatCounter value={stats.totalCourses} label="Courses" suffix="+" />
                <StatCounter value={stats.totalEnrollments} label="Enrollments" suffix="+" />
                <StatCounter value={stats.hoursOfLearning} label="Hours Learned" suffix="+" />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-emerald-600">Featured Courses</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Learn from the best</h2>
          <p className="max-w-lg mx-auto text-lg text-slate-600">
            Explore our most popular and highest-rated courses
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCourses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="group cursor-pointer rounded-xl border border-emerald-100 hover:border-emerald-300 bg-white hover:bg-emerald-50/60 transition-all duration-300 overflow-hidden hover:shadow-lg animate-fadeIn"
            >
              {course.thumbnail ? (
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-lime-100 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center">
                  <BookOpen size={56} className="text-emerald-600/35" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-slate-700">{course.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-emerald-700 transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                  <span className="text-sm font-semibold text-slate-500">{course.enrollmentCount?.toLocaleString() || 0} students</span>
                  <ArrowRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-emerald-600">Why Choose Us</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Powerful Learning Features</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Everything you need to master new skills and track your progress
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="landing-section-card"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-emerald-50 border border-emerald-200">
                <Icon size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8 border-y border-emerald-100 bg-emerald-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-emerald-600">Getting Started</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Three simple steps</h2>
            <p className="text-lg text-slate-600">Start your learning journey in just a few minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="landing-step-card">
                <p className="text-4xl font-bold mb-4 text-emerald-600">{num}</p>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8">
        <div className="landing-cta-card">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-emerald-100 border border-emerald-200">
            <Users size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Ready to start learning?</h2>
          <p className="text-base mb-8 text-slate-600 max-w-lg mx-auto">
            Join thousands of learners building real skills. Sign up free and start your learning journey today with interactive courses and community support.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors inline-flex items-center gap-2 shadow-sm shadow-emerald-200 hover:shadow-md mb-4"
          >
            Create Free Account <ArrowRight size={18} />
          </button>
          <p className="text-sm text-slate-500">✓ No credit card required • ✓ Start instantly</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 px-5 text-center border-t border-gray-800 bg-gray-950">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-indigo-600">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-400">GLearnPlatform</span>
        </div>
        <p className="text-sm text-gray-500">&copy; 2026 GLearnPlatform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
