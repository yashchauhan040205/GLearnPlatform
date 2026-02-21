import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Star, Users } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = () => {
    api.get('/courses/my-courses').then(({ data }) => setCourses(data.courses || [])).catch(() => toast.error('Failed to load courses')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    try {
      await api.delete(`/courses/${id}`)
      toast.success('Course deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const LEVEL_COLORS = { beginner: 'text-green-400 bg-green-400/10', intermediate: 'text-yellow-400 bg-yellow-400/10', advanced: 'text-red-400 bg-red-400/10' }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Courses</h1>
          <p className="text-dark-400 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/educator/courses/new" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />New Course</Link>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-dark-800 rounded-2xl animate-pulse" />)}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-dark-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No courses yet. <Link to="/educator/courses/new" className="text-primary-400 hover:underline">Create your first course!</Link></p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course._id} className="card p-5 flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-600/20 flex items-center justify-center"><BookOpen className="w-6 h-6 text-primary-400" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold truncate">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${LEVEL_COLORS[course.level] || 'text-dark-400 bg-dark-800'}`}>{course.level}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${course.isPublished ? 'text-green-400 bg-green-400/10' : 'text-dark-500 bg-dark-800'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-dark-400 text-sm truncate">{course.description}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-dark-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledStudents?.length || 0} enrolled</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{course.rating?.average?.toFixed(1) || '—'}</span>
                  <span>{course.modules?.length || 0} modules</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => navigate(`/educator/courses/${course._id}/edit`)} className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(course._id)} className="p-2 rounded-lg bg-dark-700 hover:bg-red-600/20 text-dark-300 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageCourses
