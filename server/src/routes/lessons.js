const express = require('express');
const router = express.Router();
const { getCourseLessons, getLesson, createLesson, updateLesson, deleteLesson, completeLesson } = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', protect, getCourseLessons);
router.get('/:id', protect, getLesson);
router.post('/', protect, authorize('educator', 'admin'), createLesson);
router.put('/:id', protect, authorize('educator', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteLesson);
router.post('/:id/complete', protect, authorize('student'), completeLesson);

module.exports = router;
