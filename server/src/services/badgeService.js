const Badge = require('../models/Badge');
const User = require('../models/User');

/**
 * Check and award badges to a user based on their current stats
 */
const checkAndAwardBadges = async (user) => {
  try {
    const badges = await Badge.find({ isActive: true });
    const newBadges = [];
    for (const badge of badges) {
      if (user.badges.includes(badge._id)) continue;
      let earned = false;
      const { type, threshold } = badge.criteria;
      switch (type) {
        case 'xp':         earned = user.xp >= threshold; break;
        case 'streak':     earned = user.streak >= threshold; break;
        case 'courses':    earned = (user.completedCourses || []).length >= threshold; break;
        case 'lessons':    earned = (user.completedLessons || []).length >= threshold; break;
        case 'points':     earned = user.points >= threshold; break;
        default:           earned = false;
      }
      if (earned) {
        user.badges.push(badge._id);
        user.xp += badge.xpReward;
        user.points += badge.pointsReward;
        newBadges.push(badge);
      }
    }
    if (newBadges.length > 0) {
      user.calculateLevel();
      await user.save();
    }
    return newBadges;
  } catch (err) {
    console.error('Badge check error:', err);
    return [];
  }
};

// @desc Get all badges
// @route GET /api/badges
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true }).sort({ 'criteria.threshold': 1 });
    const userBadges = req.user ? req.user.badges.map(b => b.toString()) : [];
    const result = badges.map(b => ({ ...b.toObject(), earned: userBadges.includes(b._id.toString()) }));
    res.json({ success: true, badges: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create badge (admin)
// @route POST /api/badges
const createBadge = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json({ success: true, badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkAndAwardBadges, getBadges, createBadge };
