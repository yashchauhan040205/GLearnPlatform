const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { checkAndAwardBadges } = require('../services/badgeService');
const { sendWelcomeEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const safeRole = ['student', 'educator'].includes(role) ? role : 'student';
    const user = await User.create({ name, email, password, role: safeRole });
    try { await sendWelcomeEmail(user); } catch (_) {}
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, xp: user.xp, level: user.level,
        points: user.points, streak: user.streak, avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').populate('badges');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }
    // Update streak and check for badges
    user.updateStreak();
    user.calculateLevel();
    await user.save();
    
    // Check and award any new badges
    const newBadges = await checkAndAwardBadges(user);
    
    // Generate a fresh token for each login
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, xp: user.xp, level: user.level,
        points: user.points, streak: user.streak, avatar: user.avatar,
        badges: user.badges, longestStreak: user.longestStreak,
        enrolledCourses: user.enrolledCourses || [],
        completedCourses: user.completedCourses || [],
        completedLessons: user.completedLessons || [],
      },
      newBadges: newBadges.length > 0 ? newBadges : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .populate('enrolledCourses', 'title thumbnail category difficulty')
      .populate('completedCourses', 'title thumbnail');
    
    // Update streak on each me request
    user.updateStreak();
    await user.save();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, theme, preferredDifficulty } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar, theme, preferredDifficulty },
      { new: true, runValidators: true }
    ).populate('badges');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Refresh token
// @route POST /api/auth/refresh
const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    
    // Generate a fresh token
    const token = generateToken(user._id);
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, refreshToken };
