import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Shield, Bell, Palette, Save, Eye, EyeOff, Camera } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AVATAR_COLORS = ['from-purple-500 to-indigo-600', 'from-pink-500 to-rose-600', 'from-green-500 to-teal-600', 'from-orange-500 to-amber-600', 'from-blue-500 to-cyan-600']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    preferredDifficulty: user?.preferredDifficulty || 'beginner',
  })

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

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
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* Header Card */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-4xl font-black text-white`}>
              {user?.name?.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-dark-700 border border-dark-600 rounded-lg p-1.5 hover:bg-dark-600 transition-colors">
              <Camera className="w-4 h-4 text-dark-300" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <p className="text-dark-400 text-sm capitalize">{user?.role} · Level {user?.level}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 xp-bar">
                <div className="xp-bar-fill" style={{ width: `${levelProgress}%` }} />
              </div>
              <span className="text-xs text-dark-400">{user?.xp % 1000}/1000 XP</span>
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <span className="text-dark-400"><span className="text-white font-bold">{user?.points}</span> points</span>
              <span className="text-dark-400"><span className="text-white font-bold">{user?.streak?.current || 0}</span> day streak</span>
              <span className="text-dark-400"><span className="text-white font-bold">{user?.badges?.length || 0}</span> badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700 pb-0">
        {[{ key: 'profile', icon: User, label: 'Profile' }, { key: 'security', icon: Shield, label: 'Security' }, { key: 'preferences', icon: Palette, label: 'Preferences' }].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === key ? 'border-primary-500 text-white' : 'border-transparent text-dark-400 hover:text-white'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-dark-300 text-sm mb-2">Display Name</label>
            <input className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-2">Email</label>
            <input className="input w-full opacity-50" value={user?.email} readOnly />
            <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-2">Bio</label>
            <textarea className="input w-full h-24 resize-none" placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <button onClick={handleProfileSave} disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="card p-6 space-y-5">
          <h3 className="text-white font-semibold">Change Password</h3>
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
            <div key={field}>
              <label className="block text-dark-300 text-sm mb-2">{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input w-full pr-10" value={pwdForm[field]}
                  onChange={e => setPwdForm(f => ({ ...f, [field]: e.target.value }))} />
                {i === 0 && <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
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
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-dark-300 text-sm mb-3">Preferred Difficulty</label>
            <div className="flex gap-3">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, preferredDifficulty: d }))}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.preferredDifficulty === d ? 'bg-primary-600 border-primary-500 text-white' : 'border-dark-700 text-dark-400 hover:border-dark-500'}`}>
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
    </div>
  )
}

export default Profile
