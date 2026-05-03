const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
const { checkAndAwardBadges } = require('../services/badgeService');
const { getIO } = require('../socket');

// @desc Get lessons for a course
// @route GET /api/lessons/course/:courseId
const getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json({ success: true, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single lesson
// @route GET /api/lessons/:id
const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'title educator');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create lesson
// @route POST /api/lessons
const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    await Course.findByIdAndUpdate(lesson.course, { $push: { modules: lesson._id } });
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update lesson
// @route PUT /api/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Check authorization: educator can only update lessons in their courses
    if (req.user.role === 'educator') {
      const course = await Course.findById(lesson.course);
      if (course.educator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this lesson' });
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete lesson
// @route DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Check authorization: educator can only delete lessons in their courses
    if (req.user.role === 'educator') {
      const course = await Course.findById(lesson.course);
      if (course.educator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this lesson' });
      }
    }

    await Course.findByIdAndUpdate(lesson.course, { $pull: { modules: lesson._id } });
    await lesson.deleteOne();
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark lesson as complete
// @route POST /api/lessons/:id/complete
const completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    const user = await User.findById(req.user._id);
    if (user.completedLessons.some(id => id.toString() === lesson._id.toString())) {
      return res.json({ success: true, message: 'Already completed', alreadyCompleted: true });
    }
    user.completedLessons.push(lesson._id);
    user.xp += lesson.xpReward;
    user.points += lesson.pointsReward;
    user.updateStreak();
    user.calculateLevel();
    await user.save();

    // Check if all lessons in course completed
    const courseLessons = await Lesson.find({ course: lesson.course });
    const allCompleted = courseLessons.every(l => user.completedLessons.some(id => id.toString() === l._id.toString()));
    if (allCompleted && !user.completedCourses.some(id => id.toString() === lesson.course.toString())) {
      const course = await Course.findById(lesson.course);
      user.completedCourses.push(lesson.course);
      user.xp += course?.xpReward || 500;
      user.points += course?.pointsReward || 100;
      user.calculateLevel();
      await user.save();
    }

    const newBadges = await checkAndAwardBadges(user);
    
    // Emit real-time XP update to user
    try {
      const io = getIO();
      io.to(`user:${user._id}`).emit('xp:update', {
        xp: user.xp,
        level: user.level,
        points: user.points,
        streak: user.streak,
        xpEarned: lesson.xpReward,
      });
      
      // Update leaderboard in real-time
      io.to('leaderboard').emit('leaderboard:update');
    } catch (err) {
      console.log('Socket emission error:', err.message);
    }
    
    res.json({
      success: true,
      xpEarned: lesson.xpReward,
      pointsEarned: lesson.pointsReward,
      newBadges,
      userXP: user.xp,
      userLevel: user.level,
      streak: user.streak,
      courseCompleted: allCompleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourseLessons, getLesson, createLesson, updateLesson, deleteLesson, completeLesson };
