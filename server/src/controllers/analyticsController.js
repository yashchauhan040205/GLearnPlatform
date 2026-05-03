const User = require('../models/User');
const Course = require('../models/Course');
const Attempt = require('../models/Attempt');
const Lesson = require('../models/Lesson');

// @desc Get student analytics
// @route GET /api/analytics/student
const getStudentAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .populate('completedCourses', 'title category')
      .populate('enrolledCourses', 'title category');

    const attempts = await Attempt.find({ student: req.user._id })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .sort({ createdAt: 1 });

    // Weekly XP progress (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const dayAttempts = attempts.filter(a => a.completedAt >= start && a.completedAt <= end);
      weeklyData.push({
        date: start.toLocaleDateString('en-US', { weekday: 'short' }),
        xp: dayAttempts.reduce((sum, a) => sum + a.xpEarned, 0),
        quizzes: dayAttempts.length,
      });
    }

    // Category performance
    const categoryStats = {};
    attempts.forEach(a => {
      if (a.course) {
        const cat = a.course.category || 'General';
        if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };
        categoryStats[cat].total += a.score;
        categoryStats[cat].count += 1;
      }
    });
    const categoryPerformance = Object.entries(categoryStats).map(([cat, data]) => ({
      category: cat,
      avgScore: Math.round(data.total / data.count),
    }));

    const passedAttempts = attempts.filter(a => a.passed).length;
    const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0;

    // Calculate leaderboard rank
    const leaderboardRank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;

    res.json({
      success: true,
      stats: {
        totalXP: user.xp,
        level: user.level,
        points: user.points,
        streak: user.streak,
        longestStreak: user.longestStreak,
        enrolledCourses: user.enrolledCourses.length,
        completedCourses: user.completedCourses.length,
        completedLessons: user.completedLessons.length,
        totalAttempts: attempts.length,
        passedQuizzes: passedAttempts,
        avgScore,
        badges: user.badges,
      },
      leaderboardRank,
      weeklyData,
      categoryPerformance,
      recentAttempts: attempts.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get educator analytics
// @route GET /api/analytics/educator
const getEducatorAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ educator: req.user._id });
    const courseIds = courses.map(c => c._id);
    
    // Total students (unique)
    const totalStudents = [...new Set(courses.flatMap(c => c.enrolledStudents.map(s => s.toString())))].length;
    
    // Course stats
    const courseStats = await Promise.all(courses.map(async (course) => {
      const completions = await User.countDocuments({ completedCourses: course._id });
      return {
        _id: course._id,
        title: course.title,
        enrollments: course.enrolledStudents.length,
        completions: completions,
        rating: course.rating || 0,
        isPublished: course.isPublished,
        createdAt: course.createdAt
      };
    }));

    // Platform stats
    const totalEnrollments = courseStats.reduce((sum, c) => sum + c.enrollments, 0);
    const totalCompletions = courseStats.reduce((sum, c) => sum + c.completions, 0);
    const completionRate = totalEnrollments > 0 ? (totalCompletions / totalEnrollments) * 100 : 0;
    const avgRating = courses.length > 0 ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length : 0;

    res.json({
      success: true,
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.isPublished).length,
      totalStudents,
      totalEnrollments,
      totalCompletions,
      completionRate,
      avgRating,
      courseStats: courseStats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get admin platform analytics
// @route GET /api/analytics/admin
const getAdminAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalAttempts, totalBadgesAwarded] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Attempt.countDocuments(),
      User.aggregate([{ $project: { badgeCount: { $size: '$badges' } } }, { $group: { _id: null, total: { $sum: '$badgeCount' } } }]).then(res => res[0]?.total || 0)
    ]);

    const roles = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    const roleBreakdown = roles.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), { student: 0, educator: 0, admin: 0 });

    const publishedCourses = await Course.countDocuments({ isPublished: true });
    
    // Average completion rate across all courses
    const allEnrolled = await Course.aggregate([{ $group: { _id: null, total: { $sum: { $size: '$enrolledStudents' } } } }]);
    const totalEnrolledCount = allEnrolled[0]?.total || 0;
    const totalCompletions = await User.aggregate([{ $group: { _id: null, total: { $sum: { $size: '$completedCourses' } } } }]);
    const totalCompletionsCount = totalCompletions[0]?.total || 0;
    const avgCompletion = totalEnrolledCount > 0 ? (totalCompletionsCount / totalEnrolledCount) * 100 : 0;

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(8).select('name email role avatar createdAt');

    // Growth data (last 6 months)
    const growthData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const [uCount, cCount] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Course.countDocuments({ createdAt: { $gte: start, $lte: end } })
      ]);
      growthData.push({ month, users: uCount, courses: cCount });
    }

    res.json({
      success: true,
      totalUsers,
      totalCourses,
      totalAttempts,
      totalBadgesAwarded,
      publishedCourses,
      avgCompletion,
      roleBreakdown,
      recentUsers,
      growthData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudentAnalytics, getEducatorAnalytics, getAdminAnalytics };
