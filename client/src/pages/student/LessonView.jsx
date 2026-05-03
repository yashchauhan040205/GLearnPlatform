import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Zap, BookOpen, Trophy, Star, TrendingUp, Flame } from 'lucide-react'
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
      
      toast.success(`+${data.xpEarned} XP earned!`, { duration: 4000 })
      
      updateUser({ 
        xp: data.userXP, 
        level: data.userLevel, 
        streak: data.streak, 
        completedLessons: [...(user?.completedLessons || []), id] 
      })
      
      if (data.newBadges?.length) {
        setNewBadge(data.newBadges[0])
        toast.success(`Badge Unlocked: ${data.newBadges[0].name}!`, { duration: 5000 })
      }
      
      if (data.courseCompleted) {
        toast.success(`Course completed! Bonus +${lesson.course?.xpReward || 500} XP!`, { duration: 5000 })
      }
      
    } catch (_) {} finally { setCompleting(false) }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!lesson) return null

  const currentIdx = courseLessons.findIndex(l => l._id === id)
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in">
      {/* Back + progress */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-dark-100 transition-colors text-sm">
          <ChevronLeft size={16} />Back to course
        </button>
        {lesson.course && (
          <span className="text-dark-500 text-xs">{currentIdx + 1} / {courseLessons.length}</span>
        )}
      </div>

      {/* Lesson header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-primary-900/20 text-primary-400 px-2 py-0.5 rounded border border-primary-700/40">
                Chapter {currentIdx + 1} of {courseLessons.length}
              </span>
              <span className="text-xs bg-dark-900 text-dark-400 px-2 py-0.5 rounded">{lesson.contentType}</span>
              <span className="text-xs bg-dark-900 text-dark-400 px-2 py-0.5 rounded capitalize">{lesson.difficulty}</span>
              {lesson.duration > 0 && <span className="text-xs text-dark-500 flex items-center gap-1"><Clock size={10} />{formatDuration(lesson.duration)}</span>}
            </div>
            <h1 className="text-xl font-bold text-dark-100">{lesson.title}</h1>
            {lesson.description && <p className="text-dark-400 text-sm mt-1">{lesson.description}</p>}
          </div>
          <div className="text-right shrink-0">
            <div className="text-primary-400 font-semibold flex items-center gap-1"><Zap size={14} />+{lesson.xpReward} XP</div>
            <div className="text-dark-500 text-xs">+{lesson.pointsReward} pts</div>
          </div>
        </div>
      </div>

      {/* Reward Info Box */}
      {!isCompleted && (
        <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <Trophy size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-dark-200 font-medium text-sm mb-1">Complete to earn rewards</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><Zap size={11} />+{lesson.xpReward} XP</span>
                <span className="text-dark-500">·</span>
                <span className="flex items-center gap-1 text-amber-400"><Star size={11} />+{lesson.pointsReward} Points</span>
                <span className="text-dark-500">·</span>
                <span className="flex items-center gap-1 text-primary-400"><TrendingUp size={11} />Leaderboard</span>
                {user?.streak >= 3 && (
                  <>
                    <span className="text-dark-500">·</span>
                    <span className="flex items-center gap-1 text-orange-500"><Flame size={11} />Streak: {user.streak}d</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-emerald-400 font-medium text-sm">Chapter Completed</h3>
              <p className="text-dark-400 text-xs">You earned {lesson.xpReward} XP from this chapter</p>
            </div>
          </div>
        </div>
      )}

      {/* Video */}
      {lesson.videoUrl && (
        <div className="card p-0 overflow-hidden">
          <div className="aspect-video bg-dark-950 flex items-center justify-center">
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
        <div className="card prose max-w-none">
          <div className="text-dark-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}

      {/* Resources */}
      {lesson.resources?.length > 0 && (
        <div className="card">
          <h3 className="text-dark-100 font-semibold mb-2 text-sm">Resources</h3>
          <div className="space-y-1.5">
            {lesson.resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm transition-colors">
                <BookOpen size={13} />{r.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => prevLesson && navigate(`/student/lessons/${prevLesson._id}`)} disabled={!prevLesson} className="btn-secondary py-2 px-4 text-sm">
          <ChevronLeft size={14} />Previous
        </button>

        <button onClick={handleComplete} disabled={isCompleted || completing} className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' : 'btn-primary'}`}>
          {isCompleted ? <><CheckCircle size={14} />Completed</> : completing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Completing...</> : <><CheckCircle size={14} />Mark Complete</>}
        </button>

        <button onClick={() => nextLesson && navigate(`/student/lessons/${nextLesson._id}`)} disabled={!nextLesson} className="btn-secondary py-2 px-4 text-sm">
          Next<ChevronRight size={14} />
        </button>
      </div>

      {newBadge && <AchievementPopup badge={newBadge} onClose={() => setNewBadge(null)} />}
    </div>
  )
}

export default LessonView
