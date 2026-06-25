const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option
  explanation: { type: String, default: '' },
  points: { type: Number, default: 10 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'], default: 'beginner' },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  questions: [questionSchema],
  timeLimit: { type: Number, default: 30 }, // in minutes
  passingScore: { type: Number, default: 60 }, // percentage
  xpReward: { type: Number, default: 100 },
  pointsReward: { type: Number, default: 50 },
  maxAttempts: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'], default: 'beginner' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
