import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, CheckCheck, HelpCircle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const DEFAULT_QUESTION = { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 10, difficulty: 'beginner' }
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const QuizEditor = () => {
  const { courseId, quizId } = useParams()
  const isEdit = Boolean(quizId)
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const [form, setForm] = useState({ title: '', description: '', timeLimit: 30, passingScore: 70, maxAttempts: 3, xpReward: 100 })
  const [questions, setQuestions] = useState([{ ...DEFAULT_QUESTION, options: ['', '', '', ''] }])

  useEffect(() => {
    if (isEdit) {
      api.get(`/quizzes/${quizId}`).then(({ data }) => {
        const q = data.quiz
        setForm({ title: q.title || '', description: q.description || '', timeLimit: q.timeLimit || 30, passingScore: q.passingScore || 70, maxAttempts: q.maxAttempts || 3, xpReward: q.xpReward || 100 })
        if (q.questions?.length) setQuestions(q.questions.map(que => ({ ...que, options: que.options?.map(o => o.text || o) || ['', '', '', ''] })))
      }).catch(() => toast.error('Failed to load quiz')).finally(() => setLoading(false))
    }
  }, [quizId])

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    for (const q of questions) {
      if (!q.question.trim()) return toast.error('All questions need text')
      if (q.options.some(o => !o.trim())) return toast.error('All options must be filled')
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        course: courseId,
        timeLimit: Number(form.timeLimit),
        passingScore: Number(form.passingScore),
        maxAttempts: Number(form.maxAttempts),
        xpReward: Number(form.xpReward),
        questions: questions.map(q => ({
          ...q,
          options: q.options.map((text, i) => ({ text, isCorrect: i === Number(q.correctAnswer) })),
          points: Number(q.points),
        }))
      }
      if (isEdit) {
        await api.put(`/quizzes/${quizId}`, payload)
        toast.success('Quiz updated!')
      } else {
        await api.post('/quizzes', payload)
        toast.success('Quiz created!')
        navigate(`/educator/courses/${courseId}/edit`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = () => setQuestions(qs => [...qs, { ...DEFAULT_QUESTION, options: ['', '', '', ''] }])
  const removeQuestion = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i))
  const updateQ = (i, field, val) => setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: val } : q))
  const updateOption = (qi, oi, val) => setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? val : o) } : q))

  const Field = ({ label, children }) => <div><label className="block text-dark-300 text-sm mb-2">{label}</label>{children}</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Quiz' : 'Create Quiz'}</h1>
          <p className="text-dark-400 text-sm">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-dark-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          {/* Quiz Settings */}
          <div className="card p-6 space-y-4">
            <h3 className="text-white font-semibold">Quiz Settings</h3>
            <Field label="Quiz Title *">
              <input className="input w-full" placeholder="e.g. React Fundamentals Quiz" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Field>
            <Field label="Description">
              <textarea className="input w-full h-20 resize-none" placeholder="What does this quiz cover?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Time Limit (min)"><input type="number" min="5" className="input w-full" value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: e.target.value }))} /></Field>
              <Field label="Passing Score (%)"><input type="number" min="1" max="100" className="input w-full" value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: e.target.value }))} /></Field>
              <Field label="Max Attempts"><input type="number" min="1" className="input w-full" value={form.maxAttempts} onChange={e => setForm(f => ({ ...f, maxAttempts: e.target.value }))} /></Field>
              <Field label="XP Reward"><input type="number" min="10" className="input w-full" value={form.xpReward} onChange={e => setForm(f => ({ ...f, xpReward: e.target.value }))} /></Field>
            </div>
          </div>

          {/* Questions */}
          {questions.map((q, qi) => (
            <div key={qi} className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary-400" />Question {qi + 1}</h3>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>

              <textarea className="input w-full resize-none" rows={2} placeholder="Enter question text..." value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} />

              <div>
                <label className="block text-dark-300 text-sm mb-2">Options (select the correct answer)</label>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-3">
                      <button onClick={() => updateQ(qi, 'correctAnswer', oi)}
                        className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${Number(q.correctAnswer) === oi ? 'border-green-500 bg-green-500' : 'border-dark-600 hover:border-dark-400'}`}>
                        {Number(q.correctAnswer) === oi && <CheckCheck className="w-3 h-3 text-white" />}
                      </button>
                      <input className="input flex-1 text-sm" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Explanation (shown after answer)">
                  <textarea className="input w-full h-16 resize-none text-sm" placeholder="Why is this the correct answer?" value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} />
                </Field>
                <div className="space-y-3">
                  <Field label="Points">
                    <input type="number" min="1" className="input w-full" value={q.points} onChange={e => updateQ(qi, 'points', e.target.value)} />
                  </Field>
                  <Field label="Difficulty">
                    <select className="input w-full" value={q.difficulty} onChange={e => updateQ(qi, 'difficulty', e.target.value)}>
                      {DIFFICULTIES.map(d => <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-dark-700 text-dark-400 hover:text-primary-400 hover:border-primary-600 rounded-2xl transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />Add Question
          </button>

          <div className="flex gap-3 pb-6">
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Saving...' : isEdit ? 'Update Quiz' : 'Create Quiz'}
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}

export default QuizEditor
