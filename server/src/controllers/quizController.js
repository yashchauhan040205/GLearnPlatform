const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Course = require('../models/Course');
const { checkAndAwardBadges } = require('../services/badgeService');
const { getIO } = require('../socket');

// @desc Get quizzes for a course
// @route GET /api/quizzes/course/:courseId
const getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isActive: true }).select('-questions.correctAnswer -questions.explanation');
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get quiz by ID (with answers hidden for students)
// @route GET /api/quizzes/:id
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    // Hide answers for students
    const quizData = quiz.toObject();
    if (req.user.role === 'student') {
      quizData.questions = quizData.questions.map(q => ({
        _id: q._id, question: q.question, options: q.options, points: q.points, difficulty: q.difficulty
      }));
    }
    res.json({ success: true, quiz: quizData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create quiz
// @route POST /api/quizzes
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit quiz attempt
// @route POST /api/quizzes/:id/submit
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check attempt limit
    const previousAttempts = await Attempt.countDocuments({ student: req.user._id, quiz: quiz._id });
    if (previousAttempts >= quiz.maxAttempts) {
      return res.status(400).json({ success: false, message: `Maximum ${quiz.maxAttempts} attempts allowed` });
    }

    // Grade answers
    let earnedPoints = 0;
    const gradedAnswers = answers.map((ans, idx) => {
      const question = quiz.questions[ans.questionIndex];
      const isCorrect = question && ans.selectedAnswer === question.correctAnswer;
      const pts = isCorrect ? question.points : 0;
      earnedPoints += pts;
      return { questionIndex: ans.questionIndex, selectedAnswer: ans.selectedAnswer, isCorrect, pointsEarned: pts };
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.3);

    // Save attempt
    const attempt = await Attempt.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      answers: gradedAnswers,
      score,
      totalPoints,
      earnedPoints,
      xpEarned,
      passed,
      timeTaken: timeTaken || 0,
      attemptNumber: previousAttempts + 1,
    });

    // Update user XP and points
    const user = await User.findById(req.user._id);
    user.xp += xpEarned;
    user.points += passed ? quiz.pointsReward : 0;
    user.calculateLevel();
    await user.save();

    // Check and award badges
    const newBadges = await checkAndAwardBadges(user);

    // Emit leaderboard update via Socket
    try {
      const io = getIO();
      io.emit('leaderboard:update', { userId: user._id, xp: user.xp, level: user.level });
    } catch (_) {}

    // Return results with explanations
    const results = gradedAnswers.map((ans, i) => ({
      ...ans,
      explanation: quiz.questions[ans.questionIndex]?.explanation || '',
      correctAnswer: quiz.questions[ans.questionIndex]?.correctAnswer,
      question: quiz.questions[ans.questionIndex]?.question,
    }));

    res.json({
      success: true,
      attempt: { ...attempt.toObject(), results },
      score, passed, xpEarned,
      pointsEarned: passed ? quiz.pointsReward : 0,
      newBadges,
      userLevel: user.level,
      userXP: user.xp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's quiz attempts
// @route GET /api/quizzes/:id/attempts
const getAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id, quiz: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update quiz
// @route PUT /api/quizzes/:id
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check authorization: educator can only update quizzes in their courses
    if (req.user.role === 'educator') {
      const course = await Course.findById(quiz.course);
      if (course.educator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this quiz' });
      }
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete quiz
// @route DELETE /api/quizzes/:id
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check authorization: educator can only delete quizzes in their courses
    if (req.user.role === 'educator') {
      const course = await Course.findById(quiz.course);
      if (course.educator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this quiz' });
      }
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourseQuizzes, getQuiz, createQuiz, submitQuiz, getAttempts, updateQuiz, deleteQuiz };
