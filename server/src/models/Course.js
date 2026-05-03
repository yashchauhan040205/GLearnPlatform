const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [String],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  price: { type: Number, default: 0 },
  requirements: [String],
  objectives: [String],
  
  xpReward: { type: Number, default: 500 },
  pointsReward: { type: Number, default: 100 },
  
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0 },
  
  isPublished: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  duration: { type: Number, default: 0 }, // in minutes
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

courseSchema.virtual('totalLessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  count: true,
});

module.exports = mongoose.model('Course', courseSchema);
