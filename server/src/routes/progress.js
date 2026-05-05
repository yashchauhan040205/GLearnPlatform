const express = require('express');
const router = express.Router();
const { getCourseProgress, markLessonComplete, getCourseCompletionStats, getLessonProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/course/:courseId', getCourseProgress);
router.post('/lesson/:courseId/:lessonId', markLessonComplete);
router.get('/stats/completion', getCourseCompletionStats);
router.get('/lesson/:lessonId', getLessonProgress);

module.exports = router;
