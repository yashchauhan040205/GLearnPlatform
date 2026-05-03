const express = require('express');
const router = express.Router();
const { getCourseQuizzes, getQuiz, createQuiz, submitQuiz, getAttempts, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuiz);
router.post('/', protect, authorize('educator', 'admin'), createQuiz);
router.put('/:id', protect, authorize('educator', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id/attempts', protect, getAttempts);

module.exports = router;
