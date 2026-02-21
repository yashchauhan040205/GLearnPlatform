import { useState, useEffect } from 'react'
import { Users, Search, Shield, UserCheck, UserX, Trash2, ChevronDown } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ROLES = ['student', 'educator', 'admin']
const ROLE_COLORS = { student: 'bg-primary-600/20 text-primary-400', educator: 'bg-green-600/20 text-green-400', admin: 'bg-red-600/20 text-red-400' }

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PER_PAGE = 15

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE, ...(search && { search }), ...(roleFilter !== 'all' && { role: roleFilter }) })
      const { data } = await api.get(`/admin/users?${params}`)
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, roleFilter])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [search])

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role })
      toast.success(`Role updated to ${role}`)
      load()
    } catch { toast.error('Failed to update role') }
  }

  const handleToggle = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !isActive })
      toast.success(isActive ? 'User deactivated' : 'User activated')
      load()
    } catch { toast.error('Failed to toggle status') }
  }

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2"><Users className="text-primary-400" />Manage Users</h1>
        <p className="text-dark-400 mt-1">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input className="input w-full pl-9" placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <div className="flex gap-2">
          {['all', ...ROLES].map(r => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-sm capitalize transition-all ${roleFilter === r ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">User</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Role</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4 hidden md:table-cell">XP / Level</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Status</th>
                <th className="text-right text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-8 bg-dark-800 rounded animate-pulse" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-dark-500">No users found</td></tr>
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{user.name?.charAt(0)}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-dark-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select className={`text-xs px-2 py-1 rounded-full capitalize font-medium border-0 bg-transparent cursor-pointer ${ROLE_COLORS[user.role] || ''}`}
                      value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)}>
                      {ROLES.map(r => <option key={r} value={r} className="bg-dark-900 text-white capitalize">{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-white text-sm">{user.xp?.toLocaleString()} XP</p>
                    <p className="text-dark-500 text-xs">Level {user.level}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.isActive !== false ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggle(user._id, user.isActive !== false)} title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                        className={`p-1.5 rounded-lg transition-colors ${user.isActive !== false ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`}>
                        {user.isActive !== false ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(user._id, user.name)} className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-dark-700">
            <p className="text-dark-400 text-sm">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-dark-800 text-sm text-dark-300 disabled:opacity-40 hover:bg-dark-700 transition-colors">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg bg-dark-800 text-sm text-dark-300 disabled:opacity-40 hover:bg-dark-700 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
