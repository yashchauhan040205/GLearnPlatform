const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

const getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Progress.countDocuments();

    const topCourses = await Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(6)
      .select('title description category enrollmentCount rating thumbnail');

    res.status(200).json({
      stats: {
        totalUsers,
        totalStudents,
        totalCourses,
        totalEnrollments,
        hoursOfLearning: Math.floor(totalEnrollments * 5),
      },
      topCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public stats', error: error.message });
  }
};

module.exports = { getPublicStats };
