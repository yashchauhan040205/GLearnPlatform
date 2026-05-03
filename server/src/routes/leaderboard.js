const express = require('express');
const router = express.Router();
const { getLeaderboard, getCourseLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getLeaderboard);
router.get('/course/:courseId', protect, getCourseLeaderboard);

module.exports = router;
