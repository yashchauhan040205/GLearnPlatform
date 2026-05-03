const Discussion = require('../models/Discussion');

// @desc Get discussions for a course
// @route GET /api/discussions/course/:courseId
const getCourseDiscussions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate('author', 'name avatar level')
      .populate('replies.author', 'name avatar level')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Discussion.countDocuments({ course: req.params.courseId });
    res.json({ success: true, discussions, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create discussion
// @route POST /api/discussions
const createDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.create({ ...req.body, author: req.user._id });
    await discussion.populate('author', 'name avatar level');
    res.status(201).json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add reply to discussion
// @route POST /api/discussions/:id/replies
const addReply = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });
    discussion.replies.push({ author: req.user._id, content: req.body.content });
    await discussion.save();
    await discussion.populate('replies.author', 'name avatar level');
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Like/unlike discussion
// @route POST /api/discussions/:id/like
const likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });
    const idx = discussion.likes.indexOf(req.user._id);
    if (idx === -1) discussion.likes.push(req.user._id);
    else discussion.likes.splice(idx, 1);
    await discussion.save();
    res.json({ success: true, likes: discussion.likes.length, liked: idx === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark discussion as resolved
// @route PUT /api/discussions/:id/resolve
const resolveDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true });
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete discussion
// @route DELETE /api/discussions/:id
const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });
    if (discussion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await discussion.deleteOne();
    res.json({ success: true, message: 'Discussion deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourseDiscussions, createDiscussion, addReply, likeDiscussion, resolveDiscussion, deleteDiscussion };
