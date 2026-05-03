import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(`/${user.role}`)
    } catch (err) {
      const errorData = err.response?.data
      if (errorData?.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first')
        navigate(`/verify-email?email=${form.email}`)
      } else {
        toast.error(errorData?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-dark-100 font-semibold">GLearnPlatform</span>
          </Link>
          <h1 className="text-xl font-bold text-dark-100">Welcome back</h1>
          <p className="text-dark-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="input w-full pl-9"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  className="input w-full pl-9 pr-9"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 justify-center"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-3 p-3 bg-dark-900 rounded-lg border border-dark-800 text-xs text-dark-400 space-y-1">
          <p className="text-dark-200 font-medium mb-1.5">Demo accounts:</p>
          <p>Student — <span className="text-primary-400">alex@example.com</span> / student123</p>
          <p>Educator — <span className="text-emerald-400">educator@glearnplatform.com</span> / educator123</p>
          <p>Admin — <span className="text-rose-400">admin@glearnplatform.com</span> / admin123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
