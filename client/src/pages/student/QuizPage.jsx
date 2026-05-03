import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
      toast[data.passed ? 'success' : 'error'](data.passed ? `Passed! +${data.xpEarned} XP` : `Try again! Score: ${data.score}%`)
    } catch (_) {} finally { setSubmitting(false) }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!quiz) return null

  const question = quiz.questions[currentQ]
  const totalQ = quiz.questions.length

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-in">
        <div className={`card text-center ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
          <h1 className={`text-2xl font-bold mb-1 ${result.passed ? 'text-emerald-600' : 'text-red-500'}`}>
            {result.passed ? 'Excellent!' : 'Keep Going!'}
          </h1>
          <p className="text-dark-400 mb-5 text-sm">{result.passed ? 'You passed the quiz!' : `You need ${quiz.passingScore}% to pass`}</p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-dark-900 rounded-lg p-3">
              <p className="text-2xl font-bold text-dark-100">{result.score}%</p>
              <p className="text-dark-500 text-xs">Score</p>
            </div>
            <div className="bg-dark-900 rounded-lg p-3">
              <p className="text-2xl font-bold text-primary-400">+{result.xpEarned}</p>
              <p className="text-dark-500 text-xs">XP Earned</p>
            </div>
            <div className="bg-dark-900 rounded-lg p-3">
              <p className="text-2xl font-bold text-primary-400">+{result.pointsEarned}</p>
              <p className="text-dark-500 text-xs">Points</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary">Back</button>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
          </div>
        </div>

        {/* Answers review */}
        <div className="card">
          <h2 className="text-dark-100 font-semibold mb-3 text-sm">Answer Review</h2>
          <div className="space-y-3">
            {result.attempt?.results?.map((r, i) => (
              <div key={i} className={`p-3 rounded-lg border ${r.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-2 mb-1">
                  {r.isCorrect ? <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" /> : <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />}
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
    <div className="max-w-2xl mx-auto space-y-4 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-dark-100 font-bold text-lg">{quiz.title}</h1>
          <p className="text-dark-400 text-sm">Question {currentQ + 1} of {totalQ}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${timeLeft < 60 ? 'bg-rose-950/50 text-rose-400 border border-rose-800/50' : 'bg-dark-900 text-dark-300 border border-dark-800'}`}>
          <Clock size={14} />
          {formatTime(timeLeft || 0)}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-fill bg-primary-500 transition-all duration-300" style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-dark-100 font-medium flex-1">{question.question}</h2>
          <span className="ml-4 text-xs bg-primary-950/50 text-primary-400 px-2 py-0.5 rounded border border-primary-800/50 shrink-0">+{question.points}pts</span>
        </div>
        <div className="space-y-2">
          {question.options.map((opt, optIdx) => (
            <button key={optIdx} onClick={() => selectAnswer(currentQ, optIdx)}
              className={`quiz-option w-full text-left flex items-center gap-3 ${answers[currentQ] === optIdx ? 'selected' : ''}`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium border shrink-0 transition-colors ${answers[currentQ] === optIdx ? 'bg-primary-500 border-primary-500 text-white' : 'border-dark-700 text-dark-400'}`}>
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className={`text-sm ${answers[currentQ] === optIdx ? 'text-dark-100' : 'text-dark-300'}`}>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0} className="btn-secondary py-2 px-4 text-sm"><ArrowLeft size={14} />Prev</button>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-6 h-6 rounded-full text-xs font-medium transition-colors ${i === currentQ ? 'bg-primary-500 text-white' : answers[i] !== undefined ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-700/50' : 'bg-dark-950 text-dark-400'}`}>
              {i + 1}
            </button>
          ))}
        </div>
        {currentQ < totalQ - 1 ? (
          <button onClick={() => setCurrentQ(q => q + 1)} className="btn-primary py-2 px-4 text-sm">Next<ArrowRight size={14} /></button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-success py-2 px-4 text-sm">
            {submitting ? 'Submitting...' : <><Trophy size={13} />Submit</>}
          </button>
        )}
      </div>

      {/* Unanswered warning */}
      {Object.keys(answers).length < totalQ && (
        <div className="flex items-center gap-2 text-primary-400 text-xs bg-primary-950/50 border border-primary-800/40 rounded-lg px-3 py-2">
          <AlertTriangle size={13} /> {totalQ - Object.keys(answers).length} questions unanswered
        </div>
      )}
    </div>
  )
}

export default QuizPage
