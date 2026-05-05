import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Shield, Bell, Palette, Save, Eye, EyeOff, Camera, BookOpen, Trash2, Star, TrendingUp, Clock, HelpCircle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AVATAR_COLORS = ['bg-indigo-600', 'bg-rose-600', 'bg-teal-600', 'bg-violet-600', 'bg-blue-600']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [reflections, setReflections] = useState([])
  const [showNewReflection, setShowNewReflection] = useState(false)
  const [newReflection, setNewReflection] = useState({ courseId: '', content: '', rating: 5, tags: '' })
  const [completedCourses, setCompletedCourses] = useState([])
  const [ongoingCourses, setOngoingCourses] = useState([])
  const [courseStats, setCourseStats] = useState(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    preferredDifficulty: user?.preferredDifficulty || 'beginner',
  })

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    if (tab === 'reflections') {
      fetchReflections()
    } else if (tab === 'progress') {
      fetchCompletedCourses()
    }
  }, [tab])

  const fetchReflections = async () => {
    try {
      const { data } = await api.get('/reflections')
      setReflections(data.data)
    } catch (err) {
      toast.error('Failed to load reflections')
    }
  }

  const fetchCompletedCourses = async () => {
    try {
      const { data } = await api.get('/progress/stats/completion')
      setCompletedCourses(data.data || [])

      // Calculate ongoing courses (enrolled but not completed)
      if (user?.enrolledCourses && user?.completedCourses) {
        const ongoing = user.enrolledCourses.filter(courseId => !user.completedCourses.includes(courseId))
        setOngoingCourses(ongoing)
      }
    } catch (err) {
      toast.error('Failed to load course stats')
    }
  }

  const handleCreateReflection = async () => {
    if (!newReflection.courseId || !newReflection.content) {
      return toast.error('Please fill in all fields')
    }
    setLoading(true)
    try {
      const { data } = await api.post('/reflections', {
        courseId: newReflection.courseId,
        content: newReflection.content,
        rating: newReflection.rating,
        tags: newReflection.tags ? newReflection.tags.split(',').map(t => t.trim()) : [],
      })
      setReflections([data.data, ...reflections])
      setNewReflection({ courseId: '', content: '', rating: 5, tags: '' })
      setShowNewReflection(false)
      toast.success('Reflection added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reflection')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReflection = async (id) => {
    if (!window.confirm('Delete this reflection?')) return
    try {
      await api.delete(`/reflections/${id}`)
      setReflections(reflections.filter(r => r._id !== id))
      toast.success('Reflection deleted')
    } catch (err) {
      toast.error('Failed to delete reflection')
    }
  }

  const handleProfileSave = async () => {
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile', form)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return toast.error('Passwords do not match')
    if (pwdForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await api.put('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword })
      toast.success('Password changed!')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const levelProgress = ((user?.xp % 1000) / 1000) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in">
      {/* Header Card */}
      <div className="card p-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className={`w-20 h-20 rounded-xl ${AVATAR_COLORS[0]} flex items-center justify-center text-3xl font-bold text-white`}>
              {user?.name?.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-gray-900 border border-gray-800 rounded-lg p-1 hover:bg-gray-950 transition-colors">
              <Camera className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-100">{user?.name}</h1>
            <p className="text-gray-400 text-sm capitalize">{user?.role} · Level {user?.level}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 xp-bar">
                <div className="xp-bar-fill" style={{ width: `${levelProgress}%` }} />
              </div>
              <span className="text-xs text-gray-400">{user?.xp % 1000}/1000 XP</span>
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <span className="text-gray-400"><span className="text-gray-100 font-semibold">{user?.points}</span> points</span>
              <span className="text-gray-400"><span className="text-gray-100 font-semibold">{user?.streak?.current || 0}</span> day streak</span>
              <span className="text-gray-400"><span className="text-gray-100 font-semibold">{user?.badges?.length || 0}</span> badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-0 overflow-x-auto">
        {[{ key: 'profile', icon: User, label: 'Profile' }, { key: 'security', icon: Shield, label: 'Security' }, { key: 'preferences', icon: Palette, label: 'Preferences' }, { key: 'progress', icon: TrendingUp, label: 'Progress' }, { key: 'reflections', icon: BookOpen, label: 'Reflections' }].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === key ? 'border-indigo-500 text-gray-100' : 'border-transparent text-gray-400 hover:text-gray-100'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-5 space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Display Name</label>
            <input className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input className="input w-full opacity-50" value={user?.email} readOnly />
            <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Bio</label>
            <textarea className="input w-full h-24 resize-none" placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <button onClick={handleProfileSave} disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="card p-5 space-y-5">
          <h3 className="text-gray-100 font-semibold">Change Password</h3>
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
            <div key={field}>
              <label className="block text-gray-300 text-sm mb-2">{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input w-full pr-10" value={pwdForm[field]}
                  onChange={e => setPwdForm(f => ({ ...f, [field]: e.target.value }))} />
                {i === 0 && <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>}
              </div>
            </div>
          ))}
          <button onClick={handlePasswordChange} disabled={loading} className="btn-primary flex items-center gap-2">
            <Shield className="w-4 h-4" />{loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

      {/* Preferences Tab */}
      {tab === 'preferences' && (
        <div className="card p-5 space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-3">Preferred Difficulty</label>
            <div className="flex gap-3">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, preferredDifficulty: d }))}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.preferredDifficulty === d ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-gray-400 hover:border-dark-500'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleProfileSave} disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}

      {/* Progress Tab */}
      {tab === 'progress' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Courses Completed</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-gray-100 font-bold text-2xl">{completedCourses.length}</p>
              <p className="text-dark-500 text-xs mt-1">Total completed</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Enrolled Courses</span>
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-gray-100 font-bold text-2xl">{user?.enrolledCourses?.length || 0}</p>
              <p className="text-dark-500 text-xs mt-1">Currently enrolled</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Total Study Time</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-gray-100 font-bold text-2xl">{completedCourses.reduce((sum, c) => sum + (c.totalTimeSpent || 0), 0)}</p>
              <p className="text-dark-500 text-xs mt-1">minutes</p>
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Quizzes Passed</span>
                <HelpCircle className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-gray-100 font-bold text-2xl">{user?.passedQuizzes || 0}</p>
              <p className="text-dark-500 text-xs mt-1">Completed quizzes</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Average Score</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-gray-100 font-bold text-2xl">{user?.avgQuizScore || 0}%</p>
              <p className="text-dark-500 text-xs mt-1">Quiz average</p>
            </div>
          </div>

          {ongoingCourses.length > 0 && (
            <div className="card p-5">
              <h3 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Ongoing Courses
              </h3>
              <div className="space-y-3">
                {ongoingCourses.map((courseId) => {
                  const course = user?.enrolledCourses?.find(c => c._id === courseId) || { _id: courseId, title: 'Course' }
                  return (
                    <div key={courseId} className="flex items-start justify-between p-3 bg-gray-950 rounded-lg border border-primary-800/30">
                      <div className="flex-1">
                        <h4 className="text-gray-100 font-medium text-sm">{course.title || 'Course'}</h4>
                        <div className="flex gap-4 mt-2 text-xs text-dark-500">
                          <span>📚 In Progress</span>
                          <span>⏳ Keep learning</span>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-indigo-400 text-sm font-semibold">→ Continue</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {completedCourses.length > 0 ? (
            <div className="card p-5">
              <h3 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Completed Courses
              </h3>
              <div className="space-y-3">
                {completedCourses.map((completion, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
                    <div className="flex-1">
                      <h4 className="text-gray-100 font-medium text-sm">{completion.courseInfo?.[0]?.title || 'Course'}</h4>
                      <div className="flex gap-4 mt-2 text-xs text-dark-500">
                        <span>📚 {completion.lessonsCompleted} lessons</span>
                        <span>⏱️ {completion.totalTimeSpent} min</span>
                        <span>📅 {new Date(completion.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-emerald-400 text-sm font-semibold">✓ Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <TrendingUp className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-gray-400">No completed courses yet. Enroll and complete a course to see your progress!</p>
            </div>
          )}
        </div>
      )}

      {/* Reflections Tab */}
      {tab === 'reflections' && (
        <div className="space-y-5">
          <button onClick={() => setShowNewReflection(!showNewReflection)} className="btn-primary flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Add New Reflection
          </button>

          {showNewReflection && (
            <div className="card p-5 space-y-4">
              <h3 className="text-gray-100 font-semibold">Write a Course Reflection</h3>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Course</label>
                <select value={newReflection.courseId} onChange={e => setNewReflection(r => ({ ...r, courseId: e.target.value }))}
                  className="input w-full">
                  <option value="">Select a completed course...</option>
                  {user?.completedCourses?.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setNewReflection(r => ({ ...r, rating: star }))}
                      className={`text-2xl transition-colors ${newReflection.rating >= star ? 'text-yellow-400' : 'text-dark-600'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Your Reflection</label>
                <textarea className="input w-full h-28 resize-none" placeholder="What did you learn? How did you feel about this course?" value={newReflection.content} onChange={e => setNewReflection(r => ({ ...r, content: e.target.value }))} />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Tags (comma-separated)</label>
                <input type="text" className="input w-full" placeholder="e.g. beginner, helpful, interactive" value={newReflection.tags} onChange={e => setNewReflection(r => ({ ...r, tags: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreateReflection} disabled={loading} className="flex-1 btn-primary">
                  {loading ? 'Saving...' : 'Save Reflection'}
                </button>
                <button onClick={() => setShowNewReflection(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {reflections.length === 0 ? (
              <div className="card p-8 text-center">
                <BookOpen className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                <p className="text-gray-400">No reflections yet. Share your thoughts about courses you've completed!</p>
              </div>
            ) : (
              reflections.map(reflection => (
                <div key={reflection._id} className="card p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-gray-100 font-semibold">{reflection.course.title}</h4>
                      <p className="text-dark-500 text-xs">{new Date(reflection.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDeleteReflection(reflection._id)} className="text-dark-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${reflection.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-dark-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{reflection.content}</p>
                  {reflection.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {reflection.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
