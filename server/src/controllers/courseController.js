const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @desc Get all courses
// @route GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { category: searchRegex }];
    }

    const courses = await Course.find(query)
      .populate('educator', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Course.countDocuments(query);
    res.json({ success: true, courses, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single course
// @route GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('educator', 'name avatar bio')
      .populate('modules');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    // req.user may be undefined since this route is public (no protect middleware)
    let isEnrolled = false;
    if (req.user) {
      isEnrolled = course.enrolledStudents.some(id => id.toString() === req.user._id.toString());
    } else {
      // Try to extract user from token if present (optional auth)
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          isEnrolled = course.enrolledStudents.some(id => id.toString() === decoded.id);
        }
      } catch (_) { /* token invalid or missing, that's fine */ }
    }
    
    res.json({ success: true, course, isEnrolled });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create course
// @route POST /api/courses
const createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, educator: req.user._id });
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update course
// @route PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Check authorization: educator can only update their own courses, admin can update any
    if (req.user.role === 'educator' && course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete course
// @route DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Check authorization: educator can only delete their own courses, admin can delete any
    if (req.user.role === 'educator' && course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    await Lesson.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Enroll in course
// @route POST /api/courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.some(id => id.toString() === course._id.toString())) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }
    user.enrolledCourses.push(course._id);
    await user.save();
    if (!course.enrolledStudents.some(id => id.toString() === user._id.toString())) {
      course.enrolledStudents.push(user._id);
      course.enrollmentCount = (course.enrollmentCount || 0) + 1;
      await course.save();
    }
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get educator's courses
// @route GET /api/courses/my-courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ educator: req.user._id }).populate('educator', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Rate a course
// @route POST /api/courses/:id/rate
const rateCourse = async (req, res) => {
  try {
    const { rating } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const newRating = ((course.rating * course.ratingsCount) + rating) / (course.ratingsCount + 1);
    course.rating = Math.round(newRating * 10) / 10;
    course.ratingsCount += 1;
    await course.save();
    res.json({ success: true, rating: course.rating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc AI-based course recommendation
// @route GET /api/courses/recommendations
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('completedCourses', 'category difficulty');
    const completedCategories = user.completedCourses.map(c => c.category);
    const difficultyMap = { easy: 'beginner', medium: 'intermediate', hard: 'advanced' };
    const targetDifficulty = difficultyMap[user.preferredDifficulty] || 'beginner';

    // Convert enrolledCourses to ObjectIds, handling both string IDs and object references
    const enrolledIds = user.enrolledCourses.map(c => {
      if (typeof c === 'string') return c;
      return c._id ? c._id.toString() : c.toString();
    });

    const recommendations = await Course.find({
      isPublished: true,
      _id: { $nin: enrolledIds },
      $or: [
        { category: { $in: completedCategories } },
        { difficulty: targetDifficulty },
      ],
    }).populate('educator', 'name avatar').limit(6);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, getMyCourses, rateCourse, getRecommendations };
