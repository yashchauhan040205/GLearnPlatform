const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, toggleUserStatus, deleteUser, getAllCourses, togglePublish } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/courses', getAllCourses);
router.put('/courses/:id/publish', togglePublish);
router.delete('/courses/:id', async (req, res) => {
  const Course = require('../models/Course');
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
