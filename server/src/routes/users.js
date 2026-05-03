const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc Get user profile by ID
// @route GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('badges', 'name icon tier').populate('completedCourses', 'title thumbnail');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Get all students (for educator)
// @route GET /api/users
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ role: 'student', isActive: true }).select('name avatar level xp points streak badges').populate('badges', 'name icon').sort({ xp: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
