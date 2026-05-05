import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, Plus, Edit, Trash2, Play, Zap } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/courses/my-courses').then(({ data }) => setCourses(data.courses || [])).catch(() => toast.error('Failed to load courses')).finally(() => setLoading(false))
  }, [])

  const LEVEL_COLORS = { beginner: 'text-green-400 bg-green-400/10', intermediate: 'text-yellow-400 bg-yellow-400/10', advanced: 'text-red-400 bg-red-400/10' }

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}"? All lessons and quizzes will also be removed.`)) return
    try {
      await api.delete(`/courses/${courseId}`)
      toast.success('Course deleted')
      setCourses(courses.filter(c => c._id !== courseId))
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-100">My Courses</h1>
          <p className="text-gray-400 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/educator/courses/new')} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-900 rounded-2xl animate-pulse" />)}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-dark-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-4">No courses created yet.</p>
          <button onClick={() => navigate('/educator/courses/new')} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Your First Course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course._id} className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-600/20 flex items-center justify-center"><BookOpen className="w-6 h-6 text-indigo-400" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-100 font-semibold truncate">{course.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${LEVEL_COLORS[course.difficulty] || 'text-gray-400 bg-gray-900'}`}>{course.difficulty}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${course.isPublished ? 'text-green-400 bg-green-400/10' : 'text-dark-500 bg-gray-800'}`}>
                      {course.isPublished ? '📤 Published' : '📝 Draft'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{course.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-dark-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledStudents?.length || 0} enrolled</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{typeof course.rating === 'number' && course.rating > 0 ? course.rating.toFixed(1) : '—'}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules?.length || 0} lessons</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => navigate(`/educator/courses/${course._id}/edit`)} className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium">
                  <Edit className="w-3 h-3" /> Edit Course
                </button>
                <button onClick={() => navigate(`/educator/courses/${course._id}/lessons/new`)} className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium">
                  <BookOpen className="w-3 h-3" /> Add Lesson
                </button>
                <button onClick={() => navigate(`/educator/courses/${course._id}/quiz/new`)} className="px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3" /> Create Quiz
                </button>
                <button onClick={() => handleDelete(course._id, course.title)} className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium ml-auto">
                  <Trash2 className="w-3 h-3" /> Delete
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
