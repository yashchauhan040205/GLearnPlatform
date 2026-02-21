import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Clock, Zap, Award, AlertTriangle, ArrowLeft, ArrowRight, Trophy } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import AchievementPopup from '../../components/gamification/AchievementPopup'

const QuizPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [startTime] = useState(Date.now())
  const [currentQ, setCurrentQ] = useState(0)
  const [newBadge, setNewBadge] = useState(null)

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(({ data }) => {
      setQuiz(data.quiz)
      setTimeLeft(data.quiz.timeLimit * 60)
    }).catch(() => navigate('/student/courses')).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!timeLeft || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const selectAnswer = (qIdx, optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = async () => {
    if (submitted || submitting) return
    setSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([qi, si]) => ({
        questionIndex: Number(qi), selectedAnswer: si
      }))
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const { data } = await api.post(`/quizzes/${id}/submit`, { answers: formattedAnswers, timeTaken })
      setResult(data)
      setSubmitted(true)
      if (data.newBadges?.length) setNewBadge(data.newBadges[0])
      updateUser({ xp: data.userXP, level: data.userLevel })
      toast[data.passed ? 'success' : 'error'](data.passed ? `🎉 Passed! +${data.xpEarned} XP` : `Try again! Score: ${data.score}%`)
    } catch (_) {} finally { setSubmitting(false) }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!quiz) return null

  const question = quiz.questions[currentQ]
  const totalQ = quiz.questions.length

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in">
        <div className={`card text-center ${result.passed ? 'bg-emerald-900/20 border-emerald-700/30' : 'bg-red-900/20 border-red-700/30'}`}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-6xl mb-4">
            {result.passed ? '🎉' : '💪'}
          </motion.div>
          <h1 className={`text-3xl font-black mb-2 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.passed ? 'Excellent!' : 'Keep Going!'}
          </h1>
          <p className="text-dark-400 mb-6">{result.passed ? 'You passed the quiz!' : `You need ${quiz.passingScore}% to pass`}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-700/50 rounded-xl p-4">
              <p className="text-3xl font-black text-white">{result.score}%</p>
              <p className="text-dark-500 text-xs">Score</p>
            </div>
            <div className="bg-dark-700/50 rounded-xl p-4">
              <p className="text-3xl font-black text-primary-400">+{result.xpEarned}</p>
              <p className="text-dark-500 text-xs">XP Earned</p>
            </div>
            <div className="bg-dark-700/50 rounded-xl p-4">
              <p className="text-3xl font-black text-yellow-400">+{result.pointsEarned}</p>
              <p className="text-dark-500 text-xs">Points</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary">← Go Back</button>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
          </div>
        </div>

        {/* Answers review */}
        <div className="card">
          <h2 className="text-white font-bold mb-4">Answer Review</h2>
          <div className="space-y-4">
            {result.attempt?.results?.map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border ${r.isCorrect ? 'border-emerald-700/40 bg-emerald-900/20' : 'border-red-700/40 bg-red-900/20'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {r.isCorrect ? <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
                  <p className="text-dark-200 text-sm font-medium">{r.question}</p>
                </div>
                <p className="text-dark-400 text-xs ml-6">{r.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {newBadge && <AchievementPopup badge={newBadge} onClose={() => setNewBadge(null)} />}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-black text-xl">{quiz.title}</h1>
          <p className="text-dark-400 text-sm">Question {currentQ + 1} of {totalQ}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-dark-700 text-dark-300'}`}>
          <Clock size={16} />
          {formatTime(timeLeft || 0)}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <motion.div animate={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} className="progress-fill bg-gradient-brand" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-white font-semibold text-lg flex-1">{question.question}</h2>
            <span className="ml-4 text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full shrink-0">+{question.points}pts</span>
          </div>
          <div className="space-y-3">
            {question.options.map((opt, optIdx) => (
              <motion.button key={optIdx} onClick={() => selectAnswer(currentQ, optIdx)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className={`quiz-option w-full text-left flex items-center gap-3 ${answers[currentQ] === optIdx ? 'selected' : ''}`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 transition-colors ${answers[currentQ] === optIdx ? 'bg-primary-500 border-primary-500 text-white' : 'border-dark-600 text-dark-400'}`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className={`text-sm ${answers[currentQ] === optIdx ? 'text-white' : 'text-dark-300'}`}>{opt}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0} className="btn-secondary py-2 px-4 text-sm"><ArrowLeft size={16} />Prev</button>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${i === currentQ ? 'bg-primary-500 text-white' : answers[i] !== undefined ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50' : 'bg-dark-700 text-dark-400'}`}>
              {i + 1}
            </button>
          ))}
        </div>
        {currentQ < totalQ - 1 ? (
          <button onClick={() => setCurrentQ(q => q + 1)} className="btn-primary py-2 px-4 text-sm">Next<ArrowRight size={16} /></button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-success py-2 px-4 text-sm">
            {submitting ? 'Submitting...' : <><Trophy size={14} />Submit</>}
          </button>
        )}
      </div>

      {/* Unanswered warning */}
      {Object.keys(answers).length < totalQ && (
        <div className="flex items-center gap-2 text-yellow-400 text-xs bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-3 py-2">
          <AlertTriangle size={14} /> {totalQ - Object.keys(answers).length} questions unanswered. You can still submit.
        </div>
      )}
    </div>
  )
}

export default QuizPage
