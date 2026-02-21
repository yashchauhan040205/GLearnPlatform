import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, FileText, Video, Link as LinkIcon, Plus, Trash2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CONTENT_TYPES = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'text', label: 'Article', icon: FileText },
  { value: 'mixed', label: 'Mixed', icon: LinkIcon },
]
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const LessonEditor = () => {
  const { courseId, lessonId } = useParams()
  const isEdit = Boolean(lessonId)
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    contentType: 'text',
    videoUrl: '',
    duration: '',
    xpReward: 50,
    difficulty: 'beginner',
    order: 1,
  })

  const [resources, setResources] = useState([{ title: '', url: '', type: 'link' }])

  useEffect(() => {
    if (isEdit) {
      api.get(`/lessons/${lessonId}`).then(({ data }) => {
        const l = data.lesson
        setForm({
          title: l.title || '',
          description: l.description || '',
          content: l.content || '',
          contentType: l.contentType || 'text',
          videoUrl: l.videoUrl || '',
          duration: l.duration || '',
          xpReward: l.xpReward || 50,
          difficulty: l.difficulty || 'beginner',
          order: l.order || 1,
        })
        if (l.resources?.length) setResources(l.resources)
      }).catch(() => toast.error('Failed to load lesson')).finally(() => setLoading(false))
    }
  }, [lessonId])

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required')
    setSaving(true)
    try {
      const payload = { ...form, course: courseId, resources: resources.filter(r => r.title && r.url), xpReward: Number(form.xpReward), order: Number(form.order), duration: Number(form.duration) || 0 }
      if (isEdit) {
        await api.put(`/lessons/${lessonId}`, payload)
        toast.success('Lesson updated!')
      } else {
        await api.post('/lessons', payload)
        toast.success('Lesson created!')
        navigate(`/educator/courses/${courseId}/edit`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const addResource = () => setResources(r => [...r, { title: '', url: '', type: 'link' }])
  const removeResource = (i) => setResources(r => r.filter((_, idx) => idx !== i))
  const updateResource = (i, field, val) => setResources(r => r.map((res, idx) => idx === i ? { ...res, [field]: val } : res))

  const Field = ({ label, children }) => (
    <div><label className="block text-dark-300 text-sm mb-2">{label}</label>{children}</div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Lesson' : 'Create Lesson'}</h1>
          <p className="text-dark-400 text-sm">Course content editor</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-dark-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          <div className="card p-6 space-y-5">
            <Field label="Lesson Title *">
              <input className="input w-full" placeholder="e.g. Introduction to React Hooks" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Field>

            <Field label="Description">
              <textarea className="input w-full h-20 resize-none" placeholder="Brief overview of this lesson..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>

            {/* Content Type */}
            <div>
              <label className="block text-dark-300 text-sm mb-2">Content Type</label>
              <div className="flex gap-3">
                {CONTENT_TYPES.map(({ value, label, icon: Icon }) => (
                  <button key={value} onClick={() => setForm(f => ({ ...f, contentType: value }))}
                    className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-xl border text-sm transition-all ${form.contentType === value ? 'bg-primary-600/20 border-primary-500 text-primary-400' : 'border-dark-700 text-dark-400 hover:border-dark-500'}`}>
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>
            </div>

            {(form.contentType === 'video' || form.contentType === 'mixed') && (
              <Field label="Video URL">
                <input className="input w-full" placeholder="https://youtube.com/..." value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} />
              </Field>
            )}

            <Field label="Content *">
              <textarea className="input w-full h-48 resize-none font-mono text-sm" placeholder="Write lesson content, markdown is supported..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Duration (min)">
                <input type="number" min="0" className="input w-full" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </Field>
              <Field label="XP Reward">
                <input type="number" min="10" max="500" className="input w-full" value={form.xpReward} onChange={e => setForm(f => ({ ...f, xpReward: e.target.value }))} />
              </Field>
              <Field label="Order">
                <input type="number" min="1" className="input w-full" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />
              </Field>
            </div>

            <Field label="Difficulty">
              <div className="flex gap-3">
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                    className={`flex-1 py-2 rounded-xl border text-sm capitalize transition-all ${form.difficulty === d ? 'bg-primary-600 border-primary-500 text-white' : 'border-dark-700 text-dark-400 hover:border-dark-500'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Resources */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Resources</h3>
              <button onClick={addResource} className="text-primary-400 text-sm flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" />Add</button>
            </div>
            {resources.map((res, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <input className="input col-span-2 text-sm" placeholder="Title" value={res.title} onChange={e => updateResource(i, 'title', e.target.value)} />
                <input className="input col-span-2 text-sm" placeholder="URL" value={res.url} onChange={e => updateResource(i, 'url', e.target.value)} />
                <button onClick={() => removeResource(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors justify-self-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Saving...' : isEdit ? 'Update Lesson' : 'Create Lesson'}
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}

export default LessonEditor
