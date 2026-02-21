import { useState, useEffect } from 'react'
import { BookOpen, Search, Eye, EyeOff, Trash2, Star, Users } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const LEVEL_COLORS = { beginner: 'text-green-400 bg-green-400/10', intermediate: 'text-yellow-400 bg-yellow-400/10', advanced: 'text-red-400 bg-red-400/10' }

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PER_PAGE = 15

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE, ...(search && { search }), ...(filter !== 'all' && { published: filter === 'published' }) })
      const { data } = await api.get(`/admin/courses?${params}`)
      setCourses(data.courses || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load courses') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, filter])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [search])

  const handleTogglePublish = async (courseId, isPublished) => {
    try {
      await api.put(`/admin/courses/${courseId}/publish`, { isPublished: !isPublished })
      toast.success(isPublished ? 'Course unpublished' : 'Course published')
      load()
    } catch { toast.error('Failed to update') }
  }

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}"? All lessons and quizzes will also be removed.`)) return
    try {
      await api.delete(`/admin/courses/${courseId}`)
      toast.success('Course deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2"><BookOpen className="text-primary-400" />Manage Courses</h1>
        <p className="text-dark-400 mt-1">{total} total courses</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input className="input w-full pl-9" placeholder="Search courses..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: 'All' }, { key: 'published', label: 'Published' }, { key: 'draft', label: 'Draft' }].map(({ key, label }) => (
            <button key={key} onClick={() => { setFilter(key); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-sm transition-all ${filter === key ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'}`}>
              {label}
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
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Course</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4 hidden md:table-cell">Educator</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Stats</th>
                <th className="text-left text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-right text-dark-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {loading ? (
                [...Array(8)].map((_, i) => <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-10 bg-dark-800 rounded animate-pulse" /></td></tr>)
              ) : courses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-dark-500">No courses found</td></tr>
              ) : courses.map(course => (
                <tr key={course._id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        {course.thumbnail ? <img src={course.thumbnail} className="w-full h-full object-cover" alt="" /> : (
                          <div className="w-full h-full bg-primary-600/20 flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-400" /></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{course.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${LEVEL_COLORS[course.level] || ''}`}>{course.level}</span>
                          <span className="text-dark-500 text-xs">{course.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-white text-sm">{course.educator?.name || '—'}</p>
                    <p className="text-dark-500 text-xs">{course.educator?.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-xs text-dark-400">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledStudents?.length || 0}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{course.rating?.average?.toFixed(1) || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleTogglePublish(course._id, course.isPublished)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition-colors ${course.isPublished ? 'bg-green-600/20 text-green-400 hover:bg-red-600/20 hover:text-red-400' : 'bg-dark-700 text-dark-400 hover:bg-green-600/20 hover:text-green-400'}`}>
                      {course.isPublished ? <><Eye className="w-3 h-3" />Published</> : <><EyeOff className="w-3 h-3" />Draft</>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <button onClick={() => handleDelete(course._id, course.title)} className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

export default AdminCourses
