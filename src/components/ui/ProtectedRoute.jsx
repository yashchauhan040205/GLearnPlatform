import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400 text-sm">Loading GLearnPlatform...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  if (role && user.role !== role && user.role !== 'admin') {
    const roleRoutes = { student: '/student', educator: '/educator', admin: '/admin' }
    return <Navigate to={roleRoutes[user.role] || '/'} replace />
  }

  return children
}

export default ProtectedRoute
