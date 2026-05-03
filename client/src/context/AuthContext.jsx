import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { initSocket, disconnectSocket, getSocket } from '../services/socket'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      // Initialize socket connection
      if (data.user?._id) {
        initSocket(data.user._id)
      }
    } catch {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      disconnectSocket()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    if (data.success) {
      localStorage.setItem('token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      // Initialize socket connection
      initSocket(data.user._id)
      // Listen for XP updates
      const socket = getSocket()
      if (socket) {
        socket.on('xp:update', (xpData) => {
          setUser(prev => ({ ...prev, xp: xpData.xp, level: xpData.level, points: xpData.points, streak: xpData.streak }))
          toast.success(`+${xpData.xpEarned} XP! 🎮`, { icon: '⚡' })
        })
      }
      toast.success(`Welcome back, ${data.user.name}! 🎮`)
      return data.user
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      if (data.success) {
        localStorage.setItem('token', data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setUser(data.user)
        // Initialize socket connection (same as login)
        if (data.user?._id) {
          initSocket(data.user._id)
          const socket = getSocket()
          if (socket) {
            socket.on('xp:update', (xpData) => {
              setUser(prev => ({ ...prev, xp: xpData.xp, level: xpData.level, points: xpData.points, streak: xpData.streak }))
              toast.success(`+${xpData.xpEarned} XP! 🎮`, { icon: '⚡' })
            })
          }
        }
        toast.success(`Welcome to GLearnPlatform, ${data.user.name}! 🚀`)
        return data.user
      }
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    disconnectSocket()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }))
  }

  const refreshToken = async () => {
    try {
      const { data } = await api.post('/auth/refresh')
      if (data.success && data.token) {
        localStorage.setItem('token', data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const value = { user, loading, login, register, logout, updateUser, fetchMe, refreshToken }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
