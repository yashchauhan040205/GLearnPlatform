import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BookOpen, Clock, Users, Star, Zap, Award, Lock, PlayCircle, CheckCircle, MessageSquare, ChevronRight } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { getDifficultyColor, formatDuration, getAvatarUrl } from '../../utils/helpers'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/lessons/course/${id}`).catch(() => ({ data: { lessons: [] } })),
        ])
        setCourse(courseRes.data.course)
        setIsEnrolled(courseRes.data.isEnrolled)
        setLessons(lessonsRes.data.lessons || [])
        try {
          const quizRes = await api.get(`/quizzes/course/${id}`)
          setQuizzes(quizRes.data.quizzes || [])
        } catch (_) {}
      } catch (_) { navigate('/student/courses') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await api.post(`/courses/${id}/enroll`)
      setIsEnrolled(true)
      toast.success('Successfully enrolled! Start learning now 🎉')
      updateUser({ enrolledCourses: [...(user?.enrolledCourses || []), id] })
    } catch (_) {} finally { setEnrolling(false) }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!course) return null

  const completedLessons = lessons.filter(l => user?.completedLessons?.includes(l._id))
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0

  return (
    <div className="space-y-5 animate-in">
      {/* Course Header */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getDifficultyColor(course.difficulty)}`}>{course.difficulty}</span>
          <span className="text-xs bg-gray-950 text-gray-400 px-2 py-0.5 rounded">{course.category}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-100 mb-2">{course.title}</h1>
        <p className="text-gray-400 mb-4 max-w-2xl text-sm">{course.description}</p>

        <div className="flex flex-wrap gap-4 text-sm mb-4">
          {[
            { icon: Star, val: `${course.rating?.toFixed(1)} (${course.ratingsCount})`, color: 'text-amber-500' },
            { icon: Users, val: `${course.enrolledStudents?.length} students`, color: 'text-indigo-400' },
            { icon: BookOpen, val: `${lessons.length} lessons`, color: 'text-emerald-400' },
            { icon: Clock, val: formatDuration(course.duration), color: 'text-cyan-400' },
            { icon: Zap, val: `+${course.xpReward} XP`, color: 'text-indigo-400' },
          ].map(({ icon: Icon, val, color }) => (
            <span key={val} className={`flex items-center gap-1 ${color}`}><Icon size={14} />{val}</span>
          ))}
        </div>

        {isEnrolled ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-indigo-400 font-medium">{completedLessons.length}/{lessons.length} lessons</span>
            </div>
            <div className="progress-bar h-2 max-w-xs">
              <div className="xp-bar" style={{ width: `${progress}%` }} />
            </div>
            {lessons.length > 0 && (
              <Link to={`/student/lessons/${lessons[0]._id}`} className="btn-primary w-fit mt-2">
                {progress > 0 ? 'Continue' : 'Start Course'} <ChevronRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <button onClick={handleEnroll} disabled={enrolling} className="btn-primary">
            {enrolling ? <><div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Enrolling...</> : 'Enroll Free'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chapters */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-100 font-semibold text-sm flex items-center gap-2">
              <BookOpen size={14} className="text-indigo-400" />
              Chapters
              {isEnrolled && <span className="text-dark-500 text-xs font-normal">({completedLessons.length}/{lessons.length})</span>}
            </h2>
            {isEnrolled && lessons.length > 0 && <span className="text-xs text-dark-500">{Math.round(progress)}%</span>}
          </div>
          
          {lessons.length === 0 ? (
            <p className="text-dark-500 text-center py-8 text-sm">No chapters yet</p>
          ) : (
            <div className="space-y-1.5">
              {lessons.map((lesson, i) => {
                const isDone = user?.completedLessons?.includes(lesson._id)
                const isAccessible = isEnrolled || lesson.isPreview
                return (
                  <div key={lesson._id} onClick={() => isAccessible && navigate(`/student/lessons/${lesson._id}`)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAccessible ? 'border-gray-700 hover:border-primary-700/50 hover:bg-gray-900 cursor-pointer' : 'border-gray-700 opacity-50 cursor-not-allowed'} ${isDone ? 'bg-emerald-900/10 border-emerald-700/30' : ''}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${isDone ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-900 text-gray-400'}`}>
                      {isDone ? <CheckCircle size={14} /> : i + 1}
                    </span>
                    <PlayCircle size={14} className={isDone ? 'text-emerald-400' : isAccessible ? 'text-indigo-400' : 'text-dark-500'} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? 'text-emerald-400 line-through' : 'text-gray-100'}`}>
                        Ch. {i + 1}: {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-dark-500 text-xs flex items-center gap-1"><Clock size={10} />{formatDuration(lesson.duration)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ${isDone ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {isDone ? 'Done' : `+${lesson.xpReward} XP`}
                    </span>
                    {!isAccessible && <Lock size={12} className="text-dark-500 shrink-0" />}
                  </div>
                )
              })}
            </div>
          )}
          
          {lessons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
              <p className="text-gray-400 text-sm">{isEnrolled ? 'Progress' : 'Total Reward'}</p>
              <span className="text-indigo-400 font-medium flex items-center gap-1 text-sm">
                <Zap size={14} />
                {isEnrolled ? `${lessons.reduce((s, l) => user?.completedLessons?.includes(l._id) ? s + l.xpReward : s, 0)}/${lessons.reduce((s, l) => s + l.xpReward, 0)}` : lessons.reduce((s, l) => s + l.xpReward, 0)} XP
              </span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {course.educator && (
            <div className="card">
              <h3 className="text-gray-100 font-semibold mb-2 text-sm">Instructor</h3>
              <div className="flex items-center gap-2">
                <img src={course.educator.avatar || getAvatarUrl(course.educator.name)} alt="" className="w-10 h-10 rounded-full border border-gray-700" />
                <div>
                  <p className="text-gray-100 font-medium text-sm">{course.educator.name}</p>
                  <p className="text-dark-500 text-xs">{course.educator.bio || 'Instructor'}</p>
                </div>
              </div>
            </div>
          )}

          {quizzes.length > 0 && (
            <div className="card">
              <h3 className="text-gray-100 font-semibold mb-2 text-sm flex items-center gap-2"><Award size={14} className="text-amber-500" />Quizzes</h3>
              <div className="space-y-1.5">
                {quizzes.map(quiz => (
                  <div key={quiz._id} onClick={() => isEnrolled && navigate(`/student/quiz/${quiz._id}`)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border border-gray-700 ${isEnrolled ? 'cursor-pointer hover:border-primary-700/50 hover:bg-gray-900' : 'opacity-50 cursor-not-allowed'} transition-colors`}>
                    <div>
                      <p className="text-gray-200 text-sm font-medium">{quiz.title}</p>
                      <p className="text-dark-500 text-xs">{quiz.questions?.length || 0}Q · {quiz.timeLimit}min</p>
                    </div>
                    <span className="text-indigo-400 text-xs">+{quiz.xpReward} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEnrolled && (
            <Link to={`/student/discussions/${id}`} className="card block hover:border-primary-700/40 transition-colors">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-indigo-400" />
                <div>
                  <p className="text-gray-100 font-medium text-sm">Discussion</p>
                  <p className="text-dark-500 text-xs">Ask questions</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
