import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react'
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
      if (user) {
        toast.success('Account created! Please verify your email to continue.')
        navigate(`/verify-email?email=${form.email}`, { replace: true })
      }
    } catch {
      // Error toast is already shown by the API interceptor
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-dark-100 font-semibold">GLearnPlatform</span>
          </Link>
          <h1 className="text-xl font-bold text-dark-100">Create your account</h1>
          <p className="text-dark-400 text-sm mt-1">Start learning today</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[{ value: 'student', icon: BookOpen, label: 'Student', desc: 'Learn & earn XP' }, { value: 'educator', icon: GraduationCap, label: 'Educator', desc: 'Create & teach' }].map(({ value, icon: Icon, label, desc }) => (
              <button key={value} type="button" onClick={() => setForm(p => ({ ...p, role: value }))}
                className={`p-3 rounded-lg border transition-colors text-left ${form.role === value ? 'border-primary-600 bg-primary-950/60' : 'border-dark-700 hover:border-dark-600'}`}>
                <Icon size={18} className={form.role === value ? 'text-primary-400 mb-1' : 'text-dark-500 mb-1'} />
                <p className={`font-medium text-sm ${form.role === value ? 'text-dark-100' : 'text-dark-300'}`}>{label}</p>
                <p className="text-dark-500 text-xs">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="name" value={form.name} onChange={handleChange} className="input pl-9" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-9" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input pl-9 pr-9" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-1">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
