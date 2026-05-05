const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const progress = await Progress.find({
      student: studentId,
      course: courseId,
    }).populate('lesson', 'title duration xpReward');

    const course = await Course.findById(courseId).populate('modules');
    const totalLessons = course.modules.length;
    const completedLessons = progress.filter(p => p.status === 'completed').length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    res.status(200).json({
      success: true,
      data: {
        progress,
        stats: {
          totalLessons,
          completedLessons,
          progressPercentage: (completedLessons / totalLessons) * 100,
          totalTimeSpent,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { timeSpent, notes } = req.body;
    const studentId = req.user.id;

    let progress = await Progress.findOne({
      student: studentId,
      course: courseId,
      lesson: lessonId,
    });

    if (!progress) {
      progress = new Progress({
        student: studentId,
        course: courseId,
        lesson: lessonId,
        status: 'completed',
        timeSpent: timeSpent || 0,
        notes: notes || '',
        completedAt: new Date(),
      });
    } else {
      progress.status = 'completed';
      progress.timeSpent = (progress.timeSpent || 0) + (timeSpent || 0);
      progress.notes = notes || progress.notes;
      progress.completedAt = new Date();
    }

    await progress.save();

    const user = await User.findById(studentId);
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      const lesson = await Lesson.findById(lessonId);
      user.xp += lesson.xpReward;
      user.points += lesson.pointsReward;
      user.calculateLevel();
      await user.save();
    }

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCourseCompletionStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const user = await User.findById(studentId);

    if (!user?.completedCourses || user.completedCourses.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const completedCoursesData = await Promise.all(
      user.completedCourses.map(async (courseId) => {
        const course = await Course.findById(courseId);
        const progressRecords = await Progress.find({
          student: studentId,
          course: courseId,
          status: 'completed',
        });

        return {
          courseInfo: [course],
          lessonsCompleted: progressRecords.length,
          totalTimeSpent: progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
          completedAt: progressRecords.length > 0 ? progressRecords[progressRecords.length - 1].completedAt : null,
          _id: courseId,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: completedCoursesData.filter(c => c.courseInfo[0]),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    const progress = await Progress.findOne({
      student: studentId,
      lesson: lessonId,
    }).populate('lesson');

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
