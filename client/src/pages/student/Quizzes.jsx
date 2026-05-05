import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HelpCircle, Clock, Zap, Filter, CheckCircle, BookOpen } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Quizzes = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allQuizzes, setAllQuizzes] = useState([])
  const [courses, setCourses] = useState([])
  const [enrolledCoursesWithQuizzes, setEnrolledCoursesWithQuizzes] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, mycourses, completed

  useEffect(() => {
    const load = async () => {
      try {
        const enrolledCourseIds = user?.enrolledCourses?.map(c =>
          typeof c === 'string' ? c : c._id
        ) || []
        const completedIds = user?.completedQuizzes?.map(q =>
          typeof q === 'string' ? q : q._id
        ) || []
        setCompletedQuizzes(completedIds)

        const coursesRes = await api.get('/courses')
        const allCoursesData = coursesRes.data.courses || []
        const quizzesData = []
        const enrolledWithQuizzes = []

        for (const course of allCoursesData) {
          try {
            const quizRes = await api.get(`/quizzes/course/${course._id}`)
            const courseQuizzes = quizRes.data.quizzes || []

            if (courseQuizzes.length > 0) {
              const mappedQuizzes = courseQuizzes.map(q => ({
                ...q,
                courseTitle: course.title,
                courseThumbnail: course.thumbnail,
                courseId: course._id,
                isEnrolled: enrolledCourseIds.includes(course._id),
              }))

              quizzesData.push(...mappedQuizzes)

              if (enrolledCourseIds.includes(course._id)) {
                enrolledWithQuizzes.push({
                  ...course,
                  quizzes: mappedQuizzes,
                })
              }
            }
          } catch (_) {}
        }

        setAllQuizzes(quizzesData)
        setEnrolledCoursesWithQuizzes(enrolledWithQuizzes)
        setCourses(allCoursesData)
      } catch (err) {
        console.error('Failed to load quizzes:', err)
        toast.error('Failed to load quizzes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.enrolledCourses])

  const getFilteredView = () => {
    if (filter === 'mycourses') {
      return { type: 'courses', data: enrolledCoursesWithQuizzes }
    } else if (filter === 'completed') {
      return { type: 'quizzes', data: allQuizzes.filter(q => completedQuizzes.includes(q._id)) }
    } else {
      return { type: 'quizzes', data: allQuizzes }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const view = getFilteredView()
  const isEmpty = view.type === 'courses' ? view.data.length === 0 : view.data.length === 0

  return (
    <div className="space-y-5 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Quizzes</h1>
        <p className="text-gray-400 text-sm">Test your knowledge and earn XP</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Quizzes', count: allQuizzes.length },
          { key: 'mycourses', label: 'My Courses', count: enrolledCoursesWithQuizzes.length },
          { key: 'completed', label: 'Completed', count: allQuizzes.filter(q => completedQuizzes.includes(q._id)).length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:text-gray-100 border border-gray-800'
            }`}
          >
            <Filter size={14} />
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="card p-12 text-center">
          <HelpCircle className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-gray-100 font-semibold mb-2">No quizzes found</h3>
          <p className="text-gray-400 text-sm mb-4">
            {filter === 'mycourses' ? 'Enroll in courses with quizzes' : filter === 'completed' ? 'No completed quizzes yet' : 'No quizzes available'}
          </p>
          <Link to="/student/courses" className="btn-primary inline-flex">
            Browse Courses
          </Link>
        </div>
      ) : view.type === 'courses' ? (
        // Courses with quizzes view
        <div className="space-y-4">
          {view.data.map((course) => (
            <div key={course._id} className="card overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-start gap-4">
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="w-20 h-20 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{course.description?.substring(0, 100)}</p>
                    <span className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded">
                      {course.quizzes?.length || 0} quiz{course.quizzes?.length !== 1 ? 'zes' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
                {course.quizzes?.map((quiz) => {
                  const isCompleted = completedQuizzes.includes(quiz._id)
                  return (
                    <div
                      key={quiz._id}
                      className={`p-4 rounded-lg border transition-all ${
                        isCompleted
                          ? 'border-emerald-700/30 bg-emerald-900/10'
                          : 'border-gray-800 bg-gray-950 hover:border-primary-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-gray-100 font-medium text-sm flex-1">{quiz.title}</h4>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        <div>
                          <p className="text-dark-500">Questions</p>
                          <p className="text-gray-100 font-semibold">{quiz.questions?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-dark-500 flex items-center gap-1"><Clock size={10} />Time</p>
                          <p className="text-gray-100 font-semibold">{quiz.timeLimit}m</p>
                        </div>
                        <div>
                          <p className="text-dark-500 flex items-center gap-1"><Zap size={10} />XP</p>
                          <p className="text-gray-100 font-semibold">+{quiz.xpReward}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/student/quiz/${quiz._id}`)}
                        className="w-full py-2 px-3 rounded text-sm font-medium bg-indigo-600 hover:bg-primary-700 text-white transition-colors"
                      >
                        {isCompleted ? '✓ Completed' : 'Start Quiz'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // All quizzes grid view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {view.data.map((quiz) => {
            const isCompleted = completedQuizzes.includes(quiz._id)
            const isAccessible = quiz.isEnrolled

            return (
              <div
                key={quiz._id}
                className={`card p-5 flex flex-col h-full transition-all ${
                  isCompleted
                    ? 'border-emerald-700/30 bg-emerald-900/10'
                    : isAccessible
                    ? 'border-primary-700/30 hover:border-primary-700/60'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-semibold text-sm mb-1">{quiz.title}</h3>
                    <p className="text-dark-500 text-xs">{quiz.courseTitle}</p>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-gray-950 rounded p-2">
                    <p className="text-dark-500">Questions</p>
                    <p className="text-gray-100 font-semibold">{quiz.questions?.length || 0}</p>
                  </div>
                  <div className="bg-gray-950 rounded p-2">
                    <p className="text-dark-500 flex items-center gap-1">
                      <Clock size={12} /> Time
                    </p>
                    <p className="text-gray-100 font-semibold">{quiz.timeLimit}m</p>
                  </div>
                  <div className="bg-gray-950 rounded p-2">
                    <p className="text-dark-500 flex items-center gap-1">
                      <Zap size={12} /> XP
                    </p>
                    <p className="text-gray-100 font-semibold">+{quiz.xpReward}</p>
                  </div>
                </div>

                <div className="text-xs text-dark-500 mb-4">
                  <span className="inline-block mr-3">Pass: {quiz.passingScore}%</span>
                  <span>Points: +{quiz.pointsReward}</span>
                </div>

                <button
                  onClick={() => isAccessible && navigate(`/student/quiz/${quiz._id}`)}
                  disabled={!isAccessible}
                  className={`mt-auto py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isAccessible
                      ? 'bg-indigo-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-800 text-dark-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? '✓ Completed' : isAccessible ? 'Start Quiz' : 'Enroll First'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Quizzes
