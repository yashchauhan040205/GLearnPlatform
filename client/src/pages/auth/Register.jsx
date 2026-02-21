import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, form.role)
      navigate(`/${user.role}`, { replace: true })
    } catch (_) {} finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12 bg-hero-pattern">
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">GLearnPlatform</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Create your account</h1>
          <p className="text-dark-400 text-sm mt-1">Start your learning adventure today</p>
        </div>

        <div className="card">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ value: 'student', icon: BookOpen, label: 'Student', desc: 'Learn & earn XP' }, { value: 'educator', icon: GraduationCap, label: 'Educator', desc: 'Create & teach' }].map(({ value, icon: Icon, label, desc }) => (
              <button key={value} type="button" onClick={() => setForm(p => ({ ...p, role: value }))}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${form.role === value ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'}`}>
                <Icon size={20} className={form.role === value ? 'text-primary-400 mb-2' : 'text-dark-500 mb-2'} />
                <p className={`font-semibold text-sm ${form.role === value ? 'text-white' : 'text-dark-300'}`}>{label}</p>
                <p className="text-dark-500 text-xs">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="name" value={form.name} onChange={handleChange} className="input pl-9" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-9" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input pl-9 pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</> : '🚀 Create Account'}
            </button>
          </form>

          <p className="text-center text-dark-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
