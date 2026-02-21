import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { MessageSquare, ThumbsUp, Reply, Pin, CheckCircle, Plus, Send, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { timeAgo } from '../../utils/helpers'

const DiscussionThread = ({ discussion, onLike, onReply, onResolve }) => {
  const { user } = useAuth()
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [loadingReply, setLoadingReply] = useState(false)

  const submitReply = async () => {
    if (!replyText.trim()) return
    setLoadingReply(true)
    try {
      await onReply(discussion._id, replyText)
      setReplyText('')
      setShowReplyBox(false)
      setShowReplies(true)
    } finally {
      setLoadingReply(false)
    }
  }

  const isLiked = discussion.likes?.includes(user?._id)

  return (
    <div className={`card p-5 space-y-4 ${discussion.isResolved ? 'border-green-500/30' : ''} ${discussion.isPinned ? 'border-yellow-500/30' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {discussion.author?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{discussion.author?.name}</p>
            <p className="text-dark-500 text-xs">{timeAgo(discussion.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {discussion.isPinned && <span className="flex items-center gap-1 text-yellow-400 text-xs"><Pin className="w-3 h-3" />Pinned</span>}
          {discussion.isResolved && <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3 h-3" />Resolved</span>}
          {(user?.role === 'educator' || user?.role === 'admin') && !discussion.isResolved && (
            <button onClick={() => onResolve(discussion._id)} className="text-xs text-dark-400 hover:text-green-400 transition-colors">Mark Resolved</button>
          )}
        </div>
      </div>

      {/* Title & Body */}
      <div>
        <h3 className="text-white font-semibold mb-1">{discussion.title}</h3>
        <p className="text-dark-300 text-sm leading-relaxed">{discussion.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm">
        <button onClick={() => onLike(discussion._id)} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary-400' : 'text-dark-400 hover:text-white'}`}>
          <ThumbsUp className="w-4 h-4" />{discussion.likes?.length || 0}
        </button>
        <button onClick={() => setShowReplyBox(!showReplyBox)} className="flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors">
          <Reply className="w-4 h-4" />Reply
        </button>
        {discussion.replies?.length > 0 && (
          <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors ml-auto">
            {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {discussion.replies.length} {discussion.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Reply Box */}
      {showReplyBox && (
        <div className="flex gap-2 pt-2 border-t border-dark-700">
          <input className="input flex-1 text-sm" placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitReply()} />
          <button onClick={submitReply} disabled={loadingReply} className="btn-primary px-3 py-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Replies */}
      {showReplies && discussion.replies?.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-dark-700 pl-4">
          {discussion.replies.map(reply => (
            <div key={reply._id} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {reply.author?.name?.charAt(0)}
              </div>
              <div className="flex-1 bg-dark-800 rounded-xl px-3 py-2">
                <p className="text-white text-xs font-medium">{reply.author?.name} <span className="text-dark-500 font-normal">{timeAgo(reply.createdAt)}</span></p>
                <p className="text-dark-300 text-sm mt-0.5">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Discussions = () => {
  const { courseId } = useParams()
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get(`/discussions/course/${courseId}`)
      setDiscussions(data.discussions || [])
    } catch { toast.error('Failed to load discussions') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (courseId) load() }, [courseId])

  const handleCreate = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return toast.error('Title and content required')
    setSubmitting(true)
    try {
      await api.post('/discussions', { ...newPost, course: courseId })
      toast.success('Discussion posted!')
      setNewPost({ title: '', content: '' })
      setShowNew(false)
      load()
    } catch { toast.error('Failed to post') }
    finally { setSubmitting(false) }
  }

  const handleLike = async (id) => {
    await api.put(`/discussions/${id}/like`)
    load()
  }

  const handleReply = async (id, content) => {
    await api.post(`/discussions/${id}/reply`, { content })
    load()
  }

  const handleResolve = async (id) => {
    await api.put(`/discussions/${id}/resolve`)
    load()
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><MessageSquare className="text-primary-400" />Discussions</h1>
          <p className="text-dark-400 mt-1">{discussions.length} thread{discussions.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />New Thread
        </button>
      </div>

      {/* New Thread Form */}
      {showNew && (
        <div className="card p-5 space-y-4 border-primary-500/30">
          <h3 className="text-white font-semibold">Start a New Discussion</h3>
          <input className="input w-full" placeholder="Title" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
          <textarea className="input w-full h-28 resize-none" placeholder="Describe your question or topic..." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={submitting} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />{submitting ? 'Posting...' : 'Post Discussion'}
            </button>
            <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Threads */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-dark-800 rounded-2xl animate-pulse" />)}</div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-20 text-dark-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No discussions yet. Start the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map(d => (
            <DiscussionThread key={d._id} discussion={d} onLike={handleLike} onReply={handleReply} onResolve={handleResolve} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Discussions
