import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Plus, Trash2, BookOpen } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Programming', 'Data Science', 'Design', 'Business', 'Mathematics', 'Science', 'Language', 'Other']
const LEVELS = ['beginner', 'intermediate', 'advanced']

const CourseEditor = () => {
  const { courseId } = useParams()
  const isEdit = Boolean(courseId)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

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
      api.get(`/courses/${courseId}`).then(({ data }) => {
        const c = data.course
        setForm({
          title: c.title || '',
          description: c.description || '',
          category: c.category || '',
          level: c.level || 'beginner',
          price: c.price || 0,
          thumbnail: c.thumbnail || '',
          tags: c.tags?.join(', ') || '',
          requirements: c.requirements?.join('\n') || '',
          objectives: c.objectives?.join('\n') || '',
        })
      }).catch(() => toast.error('Failed to load course')).finally(() => setLoading(false))
    }
  }, [courseId])

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.category) return toast.error('Title, description and category are required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
        objectives: form.objectives.split('\n').map(o => o.trim()).filter(Boolean),
      }
      if (isEdit) {
        await api.put(`/courses/${courseId}`, payload)
        toast.success('Course updated!')
      } else {
        const { data } = await api.post('/courses', payload)
        toast.success('Course created!')
        navigate(`/educator/courses/${data.course._id}/edit`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, children, hint }) => (
    <div>
      <label className="block text-dark-300 text-sm mb-2">{label}</label>
      {children}
      {hint && <p className="text-dark-500 text-xs mt-1">{hint}</p>}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/educator/courses')} className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
          <p className="text-dark-400 text-sm">{isEdit ? 'Update course details' : 'Fill in the details to publish your course'}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-dark-800 rounded-xl animate-pulse" />)}</div>
      ) : (
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
            {isEdit && (
              <button onClick={() => navigate(`/educator/courses/${courseId}/lessons`)} className="btn-secondary flex items-center gap-2">
                <BookOpen className="w-4 h-4" />Manage Lessons
              </button>
            )}
            <button onClick={() => navigate('/educator/courses')} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseEditor
