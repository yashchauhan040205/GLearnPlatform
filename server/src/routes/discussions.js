const express = require('express');
const router = express.Router();
const { getCourseDiscussions, createDiscussion, addReply, likeDiscussion, resolveDiscussion, deleteDiscussion } = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.get('/course/:courseId', protect, getCourseDiscussions);
router.post('/', protect, createDiscussion);
router.post('/:id/replies', protect, addReply);
router.post('/:id/like', protect, likeDiscussion);
router.put('/:id/resolve', protect, resolveDiscussion);
router.delete('/:id', protect, deleteDiscussion);

module.exports = router;
