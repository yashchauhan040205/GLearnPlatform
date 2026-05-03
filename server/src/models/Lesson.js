const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 },
  contentType: { type: String, enum: ['video', 'text', 'mixed'], default: 'text' },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in minutes
  xpReward: { type: Number, default: 50 },
  pointsReward: { type: Number, default: 10 },
  isPreview: { type: Boolean, default: false },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  resources: [{ title: String, url: String, type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
