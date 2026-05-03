const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc Get global leaderboard
// @route GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', limit = 10 } = req.query;
    const users = await User.find({ role: 'student', isActive: true })
      .select('name avatar level xp points streak badges')
      .populate('badges', 'name icon tier')
      .sort({ xp: -1 })
      .limit(Number(limit));
    const ranked = users.map((u, i) => ({
      rank: i + 1,
      _id: u._id,
      name: u.name,
      avatar: u.avatar,
      level: u.level,
      xp: u.xp,
      points: u.points,
      streak: u.streak,
      badgeCount: u.badges.length,
      topBadge: u.badges[u.badges.length - 1] || null,
    }));
    // Find current user rank
    let myRank = null;
    if (req.user) {
      const allUsers = await User.find({ role: 'student', isActive: true }).select('xp').sort({ xp: -1 });
      myRank = allUsers.findIndex(u => u._id.toString() === req.user._id.toString()) + 1;
    }
    res.json({ success: true, leaderboard: ranked, myRank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get course-specific leaderboard
// @route GET /api/leaderboard/course/:courseId
const getCourseLeaderboard = async (req, res) => {
  try {
    const attempts = await Attempt.aggregate([
      { $match: { course: require('mongoose').Types.ObjectId(req.params.courseId) } },
      { $group: { _id: '$student', totalScore: { $sum: '$earnedPoints' }, totalAttempts: { $sum: 1 }, avgScore: { $avg: '$score' } } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);
    const populated = await User.populate(attempts, { path: '_id', select: 'name avatar level' });
    const leaderboard = populated.map((a, i) => ({
      rank: i + 1,
      user: a._id,
      totalScore: a.totalScore,
      totalAttempts: a.totalAttempts,
      avgScore: Math.round(a.avgScore),
    }));
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeaderboard, getCourseLeaderboard };
