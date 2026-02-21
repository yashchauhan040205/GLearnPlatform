import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!course) return null

  const completedLessons = lessons.filter(l => user?.completedLessons?.includes(l._id))
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0

  return (
    <div className="space-y-6 animate-in">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-primary-900/60 to-purple-900/40 border border-primary-700/30 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getDifficultyColor(course.difficulty)}`}>{course.difficulty}</span>
            <span className="text-xs bg-dark-700/50 text-dark-300 px-2.5 py-1 rounded-full">{course.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3">{course.title}</h1>
          <p className="text-dark-300 mb-5 max-w-2xl text-sm">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm mb-6">
            {[
              { icon: Star, val: `${course.rating?.toFixed(1)} (${course.ratingsCount})`, color: 'text-yellow-400' },
              { icon: Users, val: `${course.enrolledStudents?.length} students`, color: 'text-primary-400' },
              { icon: BookOpen, val: `${lessons.length} lessons`, color: 'text-emerald-400' },
              { icon: Clock, val: formatDuration(course.duration), color: 'text-blue-400' },
              { icon: Zap, val: `+${course.xpReward} XP`, color: 'text-primary-400' },
            ].map(({ icon: Icon, val, color }) => (
              <span key={val} className={`flex items-center gap-1.5 ${color}`}><Icon size={14} />{val}</span>
            ))}
          </div>

          {isEnrolled ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Course Progress</span>
                <span className="text-primary-400 font-semibold">{completedLessons.length}/{lessons.length} lessons</span>
              </div>
              <div className="progress-bar h-3 max-w-xs">
                <motion.div className="xp-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
              </div>
              {lessons.length > 0 && (
                <Link to={`/student/lessons/${lessons[0]._id}`} className="btn-primary w-fit">
                  {progress > 0 ? 'Continue Learning' : 'Start Course'} <ChevronRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <button onClick={handleEnroll} disabled={enrolling} className="btn-primary">
              {enrolling ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enrolling...</> : '🚀 Enroll Free'}
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons list */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-primary-400" />Course Content</h2>
          {lessons.length === 0 ? (
            <p className="text-dark-500 text-center py-8">No lessons added yet</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, i) => {
                const isDone = user?.completedLessons?.includes(lesson._id)
                const isAccessible = isEnrolled || lesson.isPreview
                return (
                  <div key={lesson._id} onClick={() => isAccessible && navigate(`/student/lessons/${lesson._id}`)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${isAccessible ? 'border-dark-700 hover:border-primary-500/40 hover:bg-dark-700/50 cursor-pointer' : 'border-dark-700/50 opacity-60 cursor-not-allowed'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dark-700 text-dark-400'}`}>
                      {isDone ? <CheckCircle size={14} /> : i + 1}
                    </span>
                    <PlayCircle size={14} className={isDone ? 'text-emerald-400' : isAccessible ? 'text-primary-400' : 'text-dark-600'} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? 'text-emerald-400' : 'text-dark-200'}`}>{lesson.title}</p>
                      <p className="text-dark-500 text-xs">{formatDuration(lesson.duration)} · {lesson.difficulty}</p>
                    </div>
                    <div className="text-xs text-primary-400 shrink-0">+{lesson.xpReward} XP</div>
                    {!isAccessible && <Lock size={12} className="text-dark-600 shrink-0" />}
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Sidebar: Quizzes + Educator */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
          {/* Educator Card */}
          {course.educator && (
            <div className="card">
              <h3 className="text-white font-bold mb-3 text-sm">Instructor</h3>
              <div className="flex items-center gap-3">
                <img src={course.educator.avatar || getAvatarUrl(course.educator.name)} alt="" className="w-12 h-12 rounded-full border-2 border-dark-600" />
                <div>
                  <p className="text-white font-semibold text-sm">{course.educator.name}</p>
                  <p className="text-dark-500 text-xs">{course.educator.bio || 'Expert Instructor'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quizzes */}
          {quizzes.length > 0 && (
            <div className="card">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><Award size={16} className="text-yellow-400" />Practice Quizzes</h3>
              <div className="space-y-2">
                {quizzes.map(quiz => (
                  <div key={quiz._id} onClick={() => isEnrolled && navigate(`/student/quiz/${quiz._id}`)}
                    className={`flex items-center justify-between p-3 rounded-lg border border-dark-700 ${isEnrolled ? 'cursor-pointer hover:border-yellow-500/40 hover:bg-yellow-500/5' : 'opacity-50 cursor-not-allowed'} transition-all`}>
                    <div>
                      <p className="text-dark-200 text-sm font-medium">{quiz.title}</p>
                      <p className="text-dark-500 text-xs">{quiz.questions?.length || 0}Q · {quiz.timeLimit}min</p>
                    </div>
                    <span className="text-yellow-400 text-xs flex items-center gap-1"><Zap size={10} />+{quiz.xpReward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion link */}
          {isEnrolled && (
            <Link to={`/student/discussions/${id}`} className="card block hover:border-primary-500/40 transition-all">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-primary-400" />
                <div>
                  <p className="text-white font-semibold text-sm">Discussion Forum</p>
                  <p className="text-dark-500 text-xs">Ask questions, discuss with peers</p>
                </div>
              </div>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CourseDetail
