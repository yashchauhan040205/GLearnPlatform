import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader, BookOpen, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { API } from '../../config/api'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [showResend, setShowResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await API.get(`/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(response.data.message || 'Email verified successfully!')
        setTimeout(() => navigate('/'), 3000)
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Failed to verify email')
        if (error.response?.status === 400 && error.response?.data?.message?.includes('expired')) {
          setShowResend(true)
        }
      }
    }

    verifyEmail()
  }, [token, navigate])

  const handleResendEmail = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setResendLoading(true)
    try {
      const response = await API.post('/auth/resend-verification', { email })
      toast.success(response.data.message || 'Verification email sent!')
      setEmail('')
      setShowResend(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend email'
      toast.error(errorMessage)
    } finally {
      setResendLoading(false)
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
          <h1 className="text-xl font-bold text-dark-100">Verify Your Email</h1>
          <p className="text-dark-400 text-sm mt-1">One step closer to learning</p>
        </div>

        {/* Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
              <h2 className="text-lg font-semibold text-dark-100">Verifying your email...</h2>
              <p className="text-dark-400 text-sm">Please wait while we verify your email address</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-lg font-semibold text-dark-100">✓ Email Verified!</h2>
              <p className="text-dark-400 text-sm">{message}</p>
              <p className="text-dark-500 text-xs">Redirecting to home page...</p>
              <Link
                to="/"
                className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Go to Home
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-dark-100">Verification Failed</h2>
                <p className="text-dark-400 text-sm">{message}</p>
              </div>

              {/* Resend Form */}
              {showResend && (
                <form onSubmit={handleResendEmail} className="mt-6 space-y-3 border-t border-dark-800 pt-6">
                  <p className="text-dark-400 text-sm text-center">Request a new verification email</p>
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-3 text-dark-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input pl-10 w-full"
                        disabled={resendLoading}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full btn btn-primary disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-dark-400 text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
