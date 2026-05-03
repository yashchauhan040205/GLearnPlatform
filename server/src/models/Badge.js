const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  color: { type: String, default: '#FFD700' },
  category: { type: String, enum: ['achievement', 'streak', 'quiz', 'course', 'social', 'special'], default: 'achievement' },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'], default: 'bronze' },
  criteria: {
    type: { type: String, enum: ['xp', 'streak', 'courses', 'quizzes', 'score', 'lessons', 'points'] },
    threshold: { type: Number, required: true },
  },
  xpReward: { type: Number, default: 200 },
  pointsReward: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
