const express = require('express');
const router = express.Router();
const { getStudentAnalytics, getEducatorAnalytics, getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/student', protect, authorize('student'), getStudentAnalytics);
router.get('/educator', protect, authorize('educator'), getEducatorAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
