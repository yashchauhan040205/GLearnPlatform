import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CheckCircle, ChevronLeft, ChevronRight, PlayCircle, Clock, Zap, BookOpen } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { formatDuration } from '../../utils/helpers'
import AchievementPopup from '../../components/gamification/AchievementPopup'

const LessonView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [courseLessons, setCourseLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [newBadge, setNewBadge] = useState(null)

  const isCompleted = user?.completedLessons?.includes(id)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/lessons/${id}`)
        setLesson(data.lesson)
        if (data.lesson.course) {
          const { data: lessonsData } = await api.get(`/lessons/course/${data.lesson.course._id || data.lesson.course}`)
          setCourseLessons(lessonsData.lessons || [])
        }
      } catch (_) { navigate(-1) } finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleComplete = async () => {
    if (isCompleted || completing) return
    setCompleting(true)
    try {
      const { data } = await api.post(`/lessons/${id}/complete`)
      if (data.alreadyCompleted) { toast('Already completed!'); return }
      toast.success(`+${data.xpEarned} XP earned! 🎮`)
      updateUser({ xp: data.userXP, level: data.userLevel, streak: data.streak, completedLessons: [...(user?.completedLessons || []), id] })
      if (data.newBadges?.length) setNewBadge(data.newBadges[0])
      if (data.courseCompleted) toast.success('🏆 Course completed! Outstanding work!')
    } catch (_) {} finally { setCompleting(false) }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!lesson) return null

  const currentIdx = courseLessons.findIndex(l => l._id === id)
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in">
      {/* Back + progress */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm">
          <ChevronLeft size={18} />Back to course
        </button>
        {lesson.course && (
          <span className="text-dark-500 text-xs">{currentIdx + 1} / {courseLessons.length}</span>
        )}
      </div>

      {/* Lesson header */}
      <div className="card border-primary-700/20 bg-gradient-to-r from-primary-900/20 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">{lesson.contentType}</span>
              <span className="text-xs bg-dark-700 text-dark-400 px-2 py-0.5 rounded-full capitalize">{lesson.difficulty}</span>
              {lesson.duration > 0 && <span className="text-xs text-dark-500 flex items-center gap-1"><Clock size={10} />{formatDuration(lesson.duration)}</span>}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">{lesson.title}</h1>
            {lesson.description && <p className="text-dark-400 text-sm mt-2">{lesson.description}</p>}
          </div>
          <div className="text-right shrink-0">
            <div className="text-primary-400 font-bold flex items-center gap-1"><Zap size={14} />+{lesson.xpReward} XP</div>
            <div className="text-dark-500 text-xs">+{lesson.pointsReward} pts</div>
          </div>
        </div>
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="card p-0 overflow-hidden">
          <div className="aspect-video bg-dark-900 flex items-center justify-center">
            {lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('youtu.be') ? (
              <iframe className="w-full h-full" src={lesson.videoUrl.replace('watch?v=', 'embed/')} title="Video" allowFullScreen />
            ) : (
              <video className="w-full h-full" controls src={lesson.videoUrl} />
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {lesson.content && (
        <div className="card prose prose-invert max-w-none">
          <div className="text-dark-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}

      {/* Resources */}
      {lesson.resources?.length > 0 && (
        <div className="card">
          <h3 className="text-white font-bold mb-3 text-sm">📎 Resources</h3>
          <div className="space-y-2">
            {lesson.resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm transition-colors">
                <BookOpen size={14} />{r.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => prevLesson && navigate(`/student/lessons/${prevLesson._id}`)} disabled={!prevLesson} className="btn-secondary py-2 px-4 text-sm">
          <ChevronLeft size={16} />Previous
        </button>

        <button onClick={handleComplete} disabled={isCompleted || completing} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isCompleted ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 cursor-default' : 'btn-primary'}`}>
          {isCompleted ? <><CheckCircle size={16} />Completed!</> : completing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Completing...</> : <><CheckCircle size={16} />Mark Complete</>}
        </button>

        <button onClick={() => nextLesson && navigate(`/student/lessons/${nextLesson._id}`)} disabled={!nextLesson} className="btn-secondary py-2 px-4 text-sm">
          Next<ChevronRight size={16} />
        </button>
      </div>

      {newBadge && <AchievementPopup badge={newBadge} onClose={() => setNewBadge(null)} />}
    </div>
  )
}

export default LessonView
