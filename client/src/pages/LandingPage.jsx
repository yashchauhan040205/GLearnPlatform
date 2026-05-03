import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight, Award, TrendingUp, Zap, BarChart2, MessageSquare, Flame, ShieldCheck, Users } from 'lucide-react'
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

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStart = () => {
    if (user) navigate(`/${user.role}`)
    else navigate('/register')
  }

  return (
    <div className="landing-bg">

      {/* subtle grid overlay */}
      <div className="landing-grid-overlay" />

      {/* ── Navbar ── */}
      <nav className="relative z-10 sticky top-0 border-b border-white/10 bg-dark-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-15 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-600 shadow-md">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-sm">GLearnPlatform</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="text-sm px-4 py-2 rounded-lg font-medium text-white/60 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 bg-primary-600 text-white hover:bg-primary-500 transition-colors shadow-md"
            >
              Sign up <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-24 pb-20 text-center">
        {/* glow */}
        <div className="landing-hero-glow" />

        <div className="relative">
          <div className="landing-hero-chip">
            <ShieldCheck size={11} /> Structured learning that actually works
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-5 tracking-tight">
            The smarter way<br />
            <span className="text-primary-400">to learn online.</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-xl mx-auto text-white/60">
            Structured courses, real-time progress tracking, XP points, badges, and leaderboards — everything to keep you learning every single day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleStart}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 shadow-lg shadow-primary-900/40"
            >
              Get started free <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm border border-white/10 text-white/70 hover:text-white hover:border-white/20 bg-transparent transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-primary-200">Features</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Built for serious learners</h2>
          <p className="max-w-lg mx-auto text-sm text-white/60">
            Not just another video library. GLearnPlatform gives you structure, accountability, and reward.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="landing-section-card"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 bg-primary-500/10 border border-primary-400/30">
                <Icon size={15} className="text-primary-200" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8 bg-black/40 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-primary-200">How it works</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Three steps to get started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="landing-step-card">
                <p className="text-xs font-bold mb-4 text-primary-400" style={{ fontVariantNumeric: 'tabular-nums' }}>{num}</p>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-5 sm:px-8">
        <div className="landing-cta-card">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 bg-primary-500/10 border border-primary-400/40">
            <Users size={20} className="text-primary-200" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Start learning today</h2>
          <p className="text-sm mb-7 text-white/70">
            Sign up for free and start building real skills with structured courses, badges, and progress tracking.
          </p>
          <button
            onClick={handleStart}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm shadow-lg shadow-primary-900/40"
          >
            Create free account <ArrowRight size={15} />
          </button>
          <p className="mt-4 text-xs text-white/40">No credit card required.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 px-5 text-center border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-primary-600">
            <BookOpen size={10} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-white/40">GLearnPlatform</span>
        </div>
        <p className="text-xs text-white/30">&copy; 2026 GLearnPlatform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
