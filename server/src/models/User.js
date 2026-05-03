const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  
  // Streak
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  longestStreak: { type: Number, default: 0 },

  // Progress
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],

  // Preferences
  preferredDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  theme: { type: String, enum: ['light', 'dark'], default: 'dark' },

  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
  this.level = Math.floor(this.xp / 1000) + 1;
};

// Update streak
userSchema.methods.updateStreak = function () {
  const now = new Date();
  const last = new Date(this.lastActivity);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    this.streak += 1;
    if (this.streak > this.longestStreak) this.longestStreak = this.streak;
  } else if (diffDays > 1) {
    this.streak = 1;
  }
  this.lastActivity = now;
};

module.exports = mongoose.model('User', userSchema);
