const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glearn');

    // Create sample educator
    let educator = await User.findOne({ email: 'educator@example.com' });
    if (!educator) {
      educator = await User.create({
        name: 'John Smith',
        email: 'educator@example.com',
        password: 'password123',
        role: 'educator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=educator',
      });
    }

    // Sample courses
    const coursesData = [
      {
        title: 'React for Beginners',
        description: 'Learn React from scratch with real projects and best practices.',
        category: 'Web Development',
        educator: educator._id,
        rating: 4.8,
        enrollmentCount: 1250,
        thumbnail: 'https://images.unsplash.com/photo-1633356713687-82e5b7f2b4ab?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'beginner',
        xpReward: 500,
      },
      {
        title: 'Advanced JavaScript Patterns',
        description: 'Master advanced JavaScript concepts and design patterns for professional development.',
        category: 'Programming',
        educator: educator._id,
        rating: 4.9,
        enrollmentCount: 892,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'advanced',
        xpReward: 800,
      },
      {
        title: 'Web Design Fundamentals',
        description: 'Create beautiful and responsive web designs with modern CSS and design principles.',
        category: 'Design',
        educator: educator._id,
        rating: 4.7,
        enrollmentCount: 654,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'beginner',
        xpReward: 450,
      },
      {
        title: 'Python Data Science',
        description: 'Build data science projects with Python, Pandas, and Machine Learning libraries.',
        category: 'Data Science',
        educator: educator._id,
        rating: 4.9,
        enrollmentCount: 1820,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'intermediate',
        xpReward: 700,
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build scalable backend APIs with Node.js, Express, and MongoDB.',
        category: 'Backend',
        educator: educator._id,
        rating: 4.6,
        enrollmentCount: 945,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'intermediate',
        xpReward: 650,
      },
      {
        title: 'Mobile App Development with Flutter',
        description: 'Create beautiful cross-platform mobile apps using Flutter and Dart.',
        category: 'Mobile Development',
        educator: educator._id,
        rating: 4.8,
        enrollmentCount: 756,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504d0?w=400&h=200&fit=crop',
        isPublished: true,
        difficulty: 'intermediate',
        xpReward: 700,
      },
    ];

    // Create courses
    for (const courseData of coursesData) {
      const existingCourse = await Course.findOne({ title: courseData.title });
      if (!existingCourse) {
        await Course.create(courseData);
        console.log(`Created course: ${courseData.title}`);
      }
    }

    // Create sample students
    for (let i = 0; i < 3; i++) {
      const existingUser = await User.findOne({ email: `student${i}@example.com` });
      if (!existingUser) {
        await User.create({
          name: `Student ${i + 1}`,
          email: `student${i}@example.com`,
          password: 'password123',
          role: 'student',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
        });
      }
    }

    console.log('✅ Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
