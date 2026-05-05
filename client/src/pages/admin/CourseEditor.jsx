import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Plus, Trash2, BookOpen, FileText, HelpCircle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Programming', 'Data Science', 'Design', 'Business', 'Mathematics', 'Science', 'Language', 'Other']
const LEVELS = ['beginner', 'intermediate', 'advanced']

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-gray-300 text-sm mb-2">{label}</label>
    {children}
    {hint && <p className="text-dark-500 text-xs mt-1">{hint}</p>}
  </div>
)

const AdminCourseEditor = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    thumbnail: '',
    tags: '',
    requirements: '',
    objectives: '',
  })

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      api.get(`/courses/${id}`).then(({ data }) => {
        const c = data.course
        setForm({
          title: c.title || '',
          description: c.description || '',
          category: c.category || '',
          level: c.difficulty || c.level || 'beginner',
          price: c.price || 0,
          thumbnail: c.thumbnail || '',
          tags: c.tags?.join(', ') || '',
          requirements: c.requirements?.join('\n') || '',
          objectives: c.objectives?.join('\n') || '',
        })
      }).catch(() => toast.error('Failed to load course')).finally(() => setLoading(false))

      // Load lessons and quizzes for this course
      api.get(`/lessons/course/${id}`).then(({ data }) => setLessons(data.lessons || [])).catch(() => {})
      api.get(`/quizzes/course/${id}`).then(({ data }) => setQuizzes(data.quizzes || [])).catch(() => {})
    }
  }, [id])

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.category) return toast.error('Title, description and category are required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        difficulty: form.level,
        price: Number(form.price) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
        objectives: form.objectives.split('\n').map(o => o.trim()).filter(Boolean),
      }
      delete payload.level
      if (isEdit) {
        await api.put(`/courses/${id}`, payload)
        toast.success('Course updated!')
      } else {
        const { data } = await api.post('/courses', payload)
        toast.success('Course created!')
        navigate(`/admin/courses/${data.course._id}/edit`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return
    try {
      await api.delete(`/lessons/${lessonId}`)
      toast.success('Lesson deleted')
      setLessons(ls => ls.filter(l => l._id !== lessonId))
    } catch { toast.error('Delete failed') }
  }

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return
    try {
      await api.delete(`/quizzes/${quizId}`)
      toast.success('Quiz deleted')
      setQuizzes(qs => qs.filter(q => q._id !== quizId))
    } catch { toast.error('Delete failed') }
  }


  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/courses')} className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-100">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
          <p className="text-gray-400 text-sm">{isEdit ? 'Update course details (Admin)' : 'Fill in the details to create a new course'}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-900 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          <div className="card p-6 space-y-5">
            <Field label="Course Title *">
              <input className="input w-full" placeholder="e.g. Complete React Development Bootcamp" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Field>

            <Field label="Description *">
              <textarea className="input w-full h-32 resize-none" placeholder="What will students learn?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category *">
                <select className="input w-full" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Level">
                <select className="input w-full" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (0 = Free)" hint="Set 0 for free courses">
                <input type="number" min="0" className="input w-full" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </Field>
              <Field label="Thumbnail URL">
                <input className="input w-full" placeholder="https://..." value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} />
              </Field>
            </div>

            <Field label="Tags" hint="Comma-separated: react, javascript, frontend">
              <input className="input w-full" placeholder="react, javascript, hooks" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </Field>

            <Field label="Requirements" hint="One per line — what should students know beforehand?">
              <textarea className="input w-full h-24 resize-none" placeholder="Basic JavaScript knowledge&#10;HTML & CSS familiarity" value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} />
            </Field>

            <Field label="Learning Objectives" hint="One per line — what will students achieve?">
              <textarea className="input w-full h-24 resize-none" placeholder="Build RESTful APIs&#10;Understand React hooks" value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} />
            </Field>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />{saving ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
              </button>
              <button onClick={() => navigate('/admin/courses')} className="btn-secondary">Cancel</button>
            </div>
          </div>

          {/* Lessons & Quizzes management (only when editing) */}
          {isEdit && (
            <>
              {/* Lessons Section */}
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-100 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" /> Lessons ({lessons.length})
                  </h2>
                  <button onClick={() => navigate(`/admin/courses/${id}/lessons/new`)} className="btn-primary text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                </div>
                {lessons.length === 0 ? (
                  <p className="text-dark-500 text-sm text-center py-4">No lessons yet. Add your first lesson!</p>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((lesson, i) => (
                      <div key={lesson._id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl group">
                        <span className="text-dark-500 text-sm w-6 text-center">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-gray-100 text-sm font-medium">{lesson.title}</p>
                          <p className="text-dark-500 text-xs">{lesson.contentType} · {lesson.xpReward} XP</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/admin/lessons/${lesson._id}/edit`)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm">Edit</button>
                          <button onClick={() => handleDeleteLesson(lesson._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quizzes Section */}
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-100 font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" /> Quizzes ({quizzes.length})
                  </h2>
                  <button onClick={() => navigate(`/admin/courses/${id}/quiz/new`)} className="btn-primary text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Quiz
                  </button>
                </div>
                {quizzes.length === 0 ? (
                  <p className="text-dark-500 text-sm text-center py-4">No quizzes yet. Add your first quiz!</p>
                ) : (
                  <div className="space-y-2">
                    {quizzes.map(quiz => (
                      <div key={quiz._id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl group">
                        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-100 text-sm font-medium">{quiz.title}</p>
                          <p className="text-dark-500 text-xs">{quiz.questions?.length || 0} questions · {quiz.timeLimit} min · {quiz.xpReward} XP</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteQuiz(quiz._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default AdminCourseEditor
