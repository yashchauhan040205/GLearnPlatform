import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Trophy, Star, BookOpen, Users, ArrowRight, Award, TrendingUp, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '🎮', title: 'Gamified Learning', desc: 'Earn XP, unlock badges, and level up as you master new skills' },
  { icon: '🤖', title: 'Smart Recommendations', desc: 'Get personalized course suggestions tailored to your goals and progress' },
  { icon: '🏆', title: 'Leaderboards', desc: 'Compete with peers and climb the global rankings' },
  { icon: '🔥', title: 'Daily Streaks', desc: 'Build consistency with streak tracking and rewards' },
  { icon: '📊', title: 'Analytics', desc: 'Track your progress with detailed performance insights' },
  { icon: '💬', title: 'Community', desc: 'Discuss, collaborate and challenge your peers' },
]

const stats = [
  { icon: Users, label: 'Active Learners', value: '25K+' },
  { icon: BookOpen, label: 'Courses Available', value: '500+' },
  { icon: Award, label: 'Badges Awarded', value: '1M+' },
  { icon: TrendingUp, label: 'Completion Rate', value: '92%' },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStart = () => {
    if (user) {
      navigate(`/${user.role}`)
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">GLearnPlatform</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-dark-300 hover:text-white text-sm font-medium transition-colors">Login</button>
            <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden bg-hero-pattern">
        {/* Background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
          >
            <Zap size={12} /> Gamified · Role-Based Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            Learn. Play.{' '}
            <span className="text-gradient">Level Up.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-dark-400 text-xl mb-10 max-w-2xl mx-auto"
          >
            Turn knowledge into your superpower. Earn XP, unlock badges,
            rise up the leaderboard, and conquer skills — one quest at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button onClick={handleStart} className="btn-primary text-base py-3.5 px-8 shadow-glow">
              Start Learning Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary text-base py-3.5 px-8">
              Sign In
            </button>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <Icon size={20} className="text-primary-400 mx-auto mb-1.5" />
                <p className="text-white font-bold text-xl">{value}</p>
                <p className="text-dark-500 text-xs">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Everything you need to <span className="text-gradient">master any skill</span></h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">Our platform combines the engagement of gaming with the power of structured learning</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="card hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 sm:px-6 bg-dark-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">How it <span className="text-gradient">Works</span></h2>
            <p className="text-dark-400 text-lg">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500/50 via-purple-500/50 to-pink-500/50" />
            {[
              { step: '01', icon: '📝', title: 'Create an Account', desc: 'Sign up as a Student or Educator in under 30 seconds — no credit card needed.' },
              { step: '02', icon: '📚', title: 'Pick Your Course', desc: 'Browse 500+ courses or get AI-powered recommendations based on your interests.' },
              { step: '03', icon: '🏆', title: 'Learn & Earn Rewards', desc: 'Complete lessons, pass quizzes, earn XP, unlock badges and climb the leaderboard.' },
            ].map(({ step, icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-2xl mx-auto mb-5 shadow-glow">{icon}</div>
                <span className="text-primary-500 font-black text-xs tracking-widest uppercase mb-2 block">Step {step}</span>
                <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-900/50 to-purple-900/30 border border-primary-700/30 rounded-3xl p-12">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to level up?</h2>
            <p className="text-dark-400 mb-8 text-lg">Join thousands of learners already transforming their skills with GLearnPlatform</p>
            <button onClick={handleStart} className="btn-primary text-lg py-4 px-10 shadow-glow mx-auto">
              Start Your Journey <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-8 px-4 text-center text-dark-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={14} className="text-primary-400" />
          <span className="text-white font-semibold">GLearnPlatform</span>
        </div>
        <p>© 2026 GLearnPlatform · Gamified Learning Platform</p>
      </footer>
    </div>
  )
}

export default LandingPage
