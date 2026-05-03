const express = require('express');
const router = express.Router();
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, getMyCourses, rateCourse, getRecommendations } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/recommendations', protect, getRecommendations);
router.get('/my-courses', protect, authorize('educator', 'admin'), getMyCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('educator', 'admin'), createCourse);
router.put('/:id', protect, authorize('educator', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.post('/:id/rate', protect, authorize('student'), rateCourse);

module.exports = router;
