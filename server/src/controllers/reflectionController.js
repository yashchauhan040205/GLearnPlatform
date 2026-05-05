const Reflection = require('../models/Reflection');
const Course = require('../models/Course');

exports.getMyReflections = async (req, res) => {
  try {
    const reflections = await Reflection.find({ student: req.user.id })
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reflections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createReflection = async (req, res) => {
  try {
    const { courseId, content, rating, tags } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const reflection = await Reflection.create({
      student: req.user.id,
      course: courseId,
      content,
      rating: rating || 5,
      tags: tags || [],
    });

    await reflection.populate('course', 'title thumbnail');

    res.status(201).json({ success: true, data: reflection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateReflection = async (req, res) => {
  try {
    let reflection = await Reflection.findById(req.params.id);

    if (!reflection) {
      return res.status(404).json({ success: false, message: 'Reflection not found' });
    }

    if (reflection.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this reflection' });
    }

    const { content, rating, tags, isPrivate } = req.body;
    if (content) reflection.content = content;
    if (rating) reflection.rating = rating;
    if (tags) reflection.tags = tags;
    if (typeof isPrivate !== 'undefined') reflection.isPrivate = isPrivate;

    await reflection.save();
    await reflection.populate('course', 'title thumbnail');

    res.status(200).json({ success: true, data: reflection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);

    if (!reflection) {
      return res.status(404).json({ success: false, message: 'Reflection not found' });
    }

    if (reflection.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reflection' });
    }

    await Reflection.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Reflection deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
