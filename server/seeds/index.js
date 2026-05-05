require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
const Quiz = require('../src/models/Quiz');
const Badge = require('../src/models/Badge');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamified_learning');
  console.log('✅ Connected to MongoDB');
};

const seedBadges = [
  { name: 'First Steps', description: 'Complete your first lesson', icon: '👣', color: '#CD7F32', category: 'achievement', tier: 'bronze', criteria: { type: 'lessons', threshold: 1 }, xpReward: 100, pointsReward: 25 },
  { name: 'Knowledge Seeker', description: 'Earn 500 XP', icon: '📚', color: '#CD7F32', category: 'achievement', tier: 'bronze', criteria: { type: 'xp', threshold: 500 }, xpReward: 150, pointsReward: 30 },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', color: '#C0C0C0', category: 'streak', tier: 'silver', criteria: { type: 'streak', threshold: 7 }, xpReward: 300, pointsReward: 75 },
  { name: 'Course Champion', description: 'Complete your first course', icon: '🏆', color: '#C0C0C0', category: 'course', tier: 'silver', criteria: { type: 'courses', threshold: 1 }, xpReward: 500, pointsReward: 100 },
  { name: 'XP Master', description: 'Earn 5000 XP', icon: '⚡', color: '#FFD700', category: 'achievement', tier: 'gold', criteria: { type: 'xp', threshold: 5000 }, xpReward: 1000, pointsReward: 250 },
  { name: 'Marathon Learner', description: 'Maintain a 30-day streak', icon: '🌟', color: '#FFD700', category: 'streak', tier: 'gold', criteria: { type: 'streak', threshold: 30 }, xpReward: 1500, pointsReward: 400 },
  { name: 'Polymath', description: 'Complete 5 courses', icon: '🧠', color: '#E5E4E2', category: 'course', tier: 'platinum', criteria: { type: 'courses', threshold: 5 }, xpReward: 2500, pointsReward: 600 },
  { name: 'Legend', description: 'Earn 25000 XP', icon: '💎', color: '#B9F2FF', category: 'achievement', tier: 'diamond', criteria: { type: 'xp', threshold: 25000 }, xpReward: 5000, pointsReward: 1500 },
  { name: 'Quiz Master', description: 'Pass 5 quizzes', icon: '🎯', color: '#CD7F32', category: 'quiz', tier: 'bronze', criteria: { type: 'quizzes', threshold: 5 }, xpReward: 250, pointsReward: 50 },
  { name: 'Rapid Learner', description: 'Complete 5 lessons in one day', icon: '⚙️', color: '#C0C0C0', category: 'achievement', tier: 'silver', criteria: { type: 'lessons', threshold: 5 }, xpReward: 400, pointsReward: 100 },
  { name: 'Perfect Score', description: 'Score 100% on a quiz', icon: '✨', color: '#FFD700', category: 'quiz', tier: 'gold', criteria: { type: 'score', threshold: 100 }, xpReward: 800, pointsReward: 200 },
  { name: 'Consistent Learner', description: 'Maintain a 14-day streak', icon: '💪', color: '#C0C0C0', category: 'streak', tier: 'silver', criteria: { type: 'streak', threshold: 14 }, xpReward: 350, pointsReward: 80 },
  { name: 'Course Collector', description: 'Enroll in 10 courses', icon: '📖', color: '#FFD700', category: 'course', tier: 'gold', criteria: { type: 'courses', threshold: 10 }, xpReward: 1200, pointsReward: 300 },
  { name: 'High Achiever', description: 'Earn 10000 XP', icon: '🚀', color: '#E5E4E2', category: 'achievement', tier: 'platinum', criteria: { type: 'xp', threshold: 10000 }, xpReward: 2000, pointsReward: 500 },
  { name: 'Eternal Learner', description: 'Maintain a 60-day streak', icon: '🌈', color: '#E5E4E2', category: 'streak', tier: 'platinum', criteria: { type: 'streak', threshold: 60 }, xpReward: 3000, pointsReward: 800 },
  { name: 'Super Genius', description: 'Earn 50000 XP', icon: '🔮', color: '#B9F2FF', category: 'achievement', tier: 'diamond', criteria: { type: 'xp', threshold: 50000 }, xpReward: 8000, pointsReward: 2500 },
  { name: 'Quiz Legend', description: 'Pass 25 quizzes', icon: '🏅', color: '#B9F2FF', category: 'quiz', tier: 'diamond', criteria: { type: 'quizzes', threshold: 25 }, xpReward: 3500, pointsReward: 1000 },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    // Clear existing data
    await Promise.all([User.deleteMany(), Course.deleteMany(), Lesson.deleteMany(), Quiz.deleteMany(), Badge.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Seed badges
    const badges = await Badge.insertMany(seedBadges);
    console.log(`✅ Seeded ${badges.length} badges`);

    // Seed users
    const adminPass = await bcrypt.hash('admin123', 12);
    const admin = await User.create({ name: 'Admin User', email: 'admin@glearnplatform.com', password: adminPass, role: 'admin', xp: 99999, level: 100, points: 50000 });

    const educator = await User.create({
      name: 'Dr. Sarah Johnson', email: 'educator@glearnplatform.com', password: await bcrypt.hash('educator123', 12),
      role: 'educator', bio: 'Expert in Web Development and AI with 10+ years experience', xp: 15000, level: 16, points: 8000,
    });

    const students = await User.insertMany([
      { name: 'Alex Chen', email: 'alex@example.com', password: await bcrypt.hash('student123', 12), role: 'student', xp: 8500, level: 9, points: 4200, streak: 15, longestStreak: 22 },
      { name: 'Maya Patel', email: 'maya@example.com', password: await bcrypt.hash('student123', 12), role: 'student', xp: 6200, level: 7, points: 3100, streak: 8, longestStreak: 14 },
      { name: 'Jordan Kim', email: 'jordan@example.com', password: await bcrypt.hash('student123', 12), role: 'student', xp: 12000, level: 13, points: 6500, streak: 28, longestStreak: 35 },
      { name: 'Riley Torres', email: 'riley@example.com', password: await bcrypt.hash('student123', 12), role: 'student', xp: 3400, level: 4, points: 1800, streak: 3, longestStreak: 7 },
      { name: 'Sam Wilson', email: 'sam@example.com', password: await bcrypt.hash('student123', 12), role: 'student', xp: 18500, level: 19, points: 9200, streak: 45, longestStreak: 60 },
    ]);
    console.log(`✅ Seeded ${students.length + 2} users`);

    // Seed courses
    const courses = await Course.insertMany([
      {
        title: 'Complete Web Development Bootcamp', description: 'Master HTML, CSS, JavaScript, React, Node.js and MongoDB from scratch.',
        category: 'Web Development', difficulty: 'beginner', educator: educator._id, isPublished: true,
        tags: ['html', 'css', 'javascript', 'react', 'nodejs'], xpReward: 2000, pointsReward: 500, duration: 360,
        enrolledStudents: students.map(s => s._id), rating: 4.8, ratingsCount: 128,
      },
      {
        title: 'Machine Learning with Python', description: 'Learn ML fundamentals, scikit-learn, neural networks and deep learning.',
        category: 'Machine Learning', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['python', 'ml', 'ai', 'tensorflow'], xpReward: 3000, pointsReward: 750, duration: 480,
        enrolledStudents: [students[0]._id, students[2]._id, students[4]._id], rating: 4.9, ratingsCount: 89,
      },
      {
        title: 'Data Structures & Algorithms', description: 'Master DSA concepts for coding interviews and competitive programming.',
        category: 'Computer Science', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['dsa', 'algorithms', 'coding'], xpReward: 2500, pointsReward: 600, duration: 300,
        enrolledStudents: [students[1]._id, students[2]._id], rating: 4.7, ratingsCount: 64,
      },
      {
        title: 'UI/UX Design Fundamentals', description: 'Learn design thinking, wireframing, prototyping and Figma.',
        category: 'Design', difficulty: 'beginner', educator: educator._id, isPublished: true,
        tags: ['design', 'ux', 'ui', 'figma'], xpReward: 1500, pointsReward: 400, duration: 240,
        enrolledStudents: [students[0]._id, students[3]._id], rating: 4.6, ratingsCount: 52,
      },
      {
        title: 'React Native Mobile Development', description: 'Build cross-platform mobile apps for iOS and Android using React Native.',
        category: 'Mobile', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['react-native', 'mobile', 'ios', 'android'], xpReward: 2800, pointsReward: 700, duration: 420,
        enrolledStudents: [students[0]._id, students[1]._id], rating: 4.7, ratingsCount: 73,
      },
      {
        title: 'Python for Data Science', description: 'Learn pandas, NumPy, matplotlib and data analysis techniques with Python.',
        category: 'Data Science', difficulty: 'beginner', educator: educator._id, isPublished: true,
        tags: ['python', 'pandas', 'data', 'analytics'], xpReward: 2200, pointsReward: 550, duration: 330,
        enrolledStudents: [students[2]._id, students[3]._id, students[4]._id], rating: 4.8, ratingsCount: 95,
      },
      {
        title: 'Cloud Computing with AWS', description: 'Master Amazon Web Services, EC2, S3, Lambda and cloud architecture.',
        category: 'Web Development', difficulty: 'advanced', educator: educator._id, isPublished: true,
        tags: ['aws', 'cloud', 'devops', 'infrastructure'], xpReward: 3500, pointsReward: 900, duration: 540,
        enrolledStudents: [students[4]._id], rating: 4.9, ratingsCount: 67,
      },
      {
        title: 'Cybersecurity Essentials', description: 'Learn ethical hacking, network security, encryption and penetration testing.',
        category: 'Computer Science', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['security', 'hacking', 'networking'], xpReward: 2600, pointsReward: 650, duration: 390,
        enrolledStudents: [students[1]._id, students[4]._id], rating: 4.7, ratingsCount: 58,
      },
      {
        title: 'Full-Stack JavaScript', description: 'Build complete web applications with MERN stack - MongoDB, Express, React, Node.js.',
        category: 'Web Development', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['javascript', 'mern', 'fullstack', 'mongodb'], xpReward: 3200, pointsReward: 800, duration: 500,
        enrolledStudents: [students[0]._id, students[2]._id], rating: 4.9, ratingsCount: 112,
      },
      {
        title: 'Digital Marketing Masterclass', description: 'Master SEO, social media marketing, content strategy, and analytics.',
        category: 'Design', difficulty: 'beginner', educator: educator._id, isPublished: true,
        tags: ['marketing', 'seo', 'social-media'], xpReward: 1800, pointsReward: 450, duration: 280,
        enrolledStudents: [students[3]._id], rating: 4.5, ratingsCount: 84,
      },
      {
        title: 'Blockchain & Cryptocurrency', description: 'Understand blockchain technology, smart contracts, and cryptocurrency fundamentals.',
        category: 'Web Development', difficulty: 'advanced', educator: educator._id, isPublished: true,
        tags: ['blockchain', 'crypto', 'web3', 'ethereum'], xpReward: 3800, pointsReward: 950, duration: 480,
        enrolledStudents: [students[2]._id], rating: 4.8, ratingsCount: 45,
      },
      {
        title: 'Deep Learning & Neural Networks', description: 'Advanced AI course covering CNNs, RNNs, GANs and transformer models.',
        category: 'Machine Learning', difficulty: 'advanced', educator: educator._id, isPublished: true,
        tags: ['ai', 'deep-learning', 'neural-networks', 'tensorflow'], xpReward: 4000, pointsReward: 1000, duration: 600,
        enrolledStudents: [students[4]._id], rating: 4.9, ratingsCount: 38,
      },
      {
        title: 'Graphic Design with Adobe Suite', description: 'Master Photoshop, Illustrator, and InDesign for professional design work.',
        category: 'Design', difficulty: 'beginner', educator: educator._id, isPublished: true,
        tags: ['photoshop', 'illustrator', 'design', 'adobe'], xpReward: 2000, pointsReward: 500, duration: 320,
        enrolledStudents: [students[0]._id, students[3]._id], rating: 4.6, ratingsCount: 91,
      },
      {
        title: 'iOS Development with Swift', description: 'Build native iOS apps using Swift, SwiftUI, and Xcode.',
        category: 'Mobile', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['swift', 'ios', 'mobile', 'xcode'], xpReward: 2900, pointsReward: 725, duration: 440,
        enrolledStudents: [students[1]._id], rating: 4.7, ratingsCount: 62,
      },
      {
        title: 'DevOps Engineering', description: 'Learn CI/CD, Docker, Kubernetes, Jenkins and infrastructure automation.',
        category: 'Web Development', difficulty: 'advanced', educator: educator._id, isPublished: true,
        tags: ['devops', 'docker', 'kubernetes', 'ci-cd'], xpReward: 3400, pointsReward: 850, duration: 510,
        enrolledStudents: [students[2]._id, students[4]._id], rating: 4.8, ratingsCount: 71,
      },
      {
        title: 'Game Development with Unity', description: 'Create 2D and 3D games using Unity engine and C# programming.',
        category: 'Computer Science', difficulty: 'intermediate', educator: educator._id, isPublished: true,
        tags: ['unity', 'game-dev', 'csharp', '3d'], xpReward: 2700, pointsReward: 675, duration: 410,
        enrolledStudents: [students[0]._id, students[3]._id], rating: 4.7, ratingsCount: 88,
      },
    ]);
    console.log(`✅ Seeded ${courses.length} courses`);

    // Seed lessons/modules for ALL courses
    const allLessons = [];

    // Course 0: Complete Web Development Bootcamp
    const course0Lessons = await Lesson.insertMany([
      { 
        title: 'Introduction to HTML', 
        course: courses[0]._id, 
        order: 1, 
        contentType: 'text', 
        content: `
          <h1>📄 Introduction to HTML</h1>
          
          <h2>What is HTML?</h2>
          <p><strong>HTML (HyperText Markup Language)</strong> is the standard markup language for creating web pages. It describes the structure and content of a webpage using a system of tags and elements.</p>
          
          <h2>🎯 Key Concepts</h2>
          <ul>
            <li><strong>Elements:</strong> Building blocks defined by tags like &lt;div&gt;, &lt;p&gt;, &lt;h1&gt;</li>
            <li><strong>Attributes:</strong> Provide additional information (id, class, src, href)</li>
            <li><strong>Semantic HTML:</strong> Using meaningful tags (&lt;header&gt;, &lt;nav&gt;, &lt;article&gt;)</li>
            <li><strong>Document Structure:</strong> &lt;!DOCTYPE&gt;, &lt;html&gt;, &lt;head&gt;, &lt;body&gt;</li>
          </ul>
          
          <h2>📚 Essential HTML Tags</h2>
          <h3>Text Content</h3>
          <ul>
            <li><code>&lt;h1&gt; to &lt;h6&gt;</code> - Headings (h1 is largest)</li>
            <li><code>&lt;p&gt;</code> - Paragraphs</li>
            <li><code>&lt;span&gt;</code> - Inline text container</li>
            <li><code>&lt;strong&gt;</code> - Bold/important text</li>
            <li><code>&lt;em&gt;</code> - Italic/emphasized text</li>
          </ul>
          
          <h3>Links and Media</h3>
          <ul>
            <li><code>&lt;a href="url"&gt;</code> - Hyperlinks</li>
            <li><code>&lt;img src="image.jpg" alt="description"&gt;</code> - Images</li>
            <li><code>&lt;video&gt;</code> - Video content</li>
            <li><code>&lt;audio&gt;</code> - Audio content</li>
          </ul>
          
          <h3>Lists and Tables</h3>
          <ul>
            <li><code>&lt;ul&gt;</code> - Unordered list (bullets)</li>
            <li><code>&lt;ol&gt;</code> - Ordered list (numbers)</li>
            <li><code>&lt;li&gt;</code> - List item</li>
            <li><code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;td&gt;</code> - Tables</li>
          </ul>
          
          <h2>💡 Example: Basic HTML Page</h2>
          <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;My First Webpage&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;h1&gt;Welcome to My Website&lt;/h1&gt;
    &lt;nav&gt;
      &lt;a href="#home"&gt;Home&lt;/a&gt;
      &lt;a href="#about"&gt;About&lt;/a&gt;
    &lt;/nav&gt;
  &lt;/header&gt;
  
  &lt;main&gt;
    &lt;article&gt;
      &lt;h2&gt;About Me&lt;/h2&gt;
      &lt;p&gt;I'm learning web development!&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;
  
  &lt;footer&gt;
    &lt;p&gt;&copy; 2026 My Website&lt;/p&gt;
  &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
          
          <h2>🚀 Best Practices</h2>
          <ul>
            <li>✅ Always use semantic HTML5 tags</li>
            <li>✅ Include alt text for images (accessibility)</li>
            <li>✅ Use proper heading hierarchy (h1 → h2 → h3)</li>
            <li>✅ Validate your HTML code</li>
            <li>✅ Keep code clean and indented</li>
          </ul>
          
          <h2>🎓 What You'll Learn Next</h2>
          <p>Now that you understand HTML structure, you'll learn CSS to style these elements and make beautiful designs!</p>
        `, 
        duration: 15, 
        xpReward: 50, 
        pointsReward: 10, 
        difficulty: 'beginner' 
      },
      { 
        title: 'CSS Fundamentals', 
        course: courses[0]._id, 
        order: 2, 
        contentType: 'text', 
        content: `
          <h1>🎨 CSS Fundamentals</h1>
          
          <h2>What is CSS?</h2>
          <p><strong>CSS (Cascading Style Sheets)</strong> is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and responsive design.</p>
          
          <h2>🎯 CSS Syntax</h2>
          <pre><code>selector {
  property: value;
  property: value;
}</code></pre>
          
          <h2>📚 Three Ways to Add CSS</h2>
          <h3>1. Inline CSS</h3>
          <pre><code>&lt;p style="color: blue; font-size: 16px;"&gt;Text&lt;/p&gt;</code></pre>
          
          <h3>2. Internal CSS</h3>
          <pre><code>&lt;style&gt;
  p { color: blue; }
&lt;/style&gt;</code></pre>
          
          <h3>3. External CSS (Best Practice)</h3>
          <pre><code>&lt;link rel="stylesheet" href="styles.css"&gt;</code></pre>
          
          <h2>🎨 CSS Selectors</h2>
          <ul>
            <li><code>element</code> - Select all elements (p, div, h1)</li>
            <li><code>.class</code> - Select elements with class="class"</li>
            <li><code>#id</code> - Select element with id="id"</li>
            <li><code>*</code> - Select all elements</li>
            <li><code>element.class</code> - Specific element with class</li>
            <li><code>element, element</code> - Multiple selectors</li>
          </ul>
          
          <h2>📦 Box Model</h2>
          <p>Every element is a box with:</p>
          <ul>
            <li><strong>Content</strong> - The actual content (text, image)</li>
            <li><strong>Padding</strong> - Space inside the border</li>
            <li><strong>Border</strong> - Edge around padding</li>
            <li><strong>Margin</strong> - Space outside the border</li>
          </ul>
          
          <h2>💡 Common CSS Properties</h2>
          <h3>Colors and Backgrounds</h3>
          <ul>
            <li><code>color</code> - Text color</li>
            <li><code>background-color</code> - Background color</li>
            <li><code>background-image</code> - Background image</li>
          </ul>
          
          <h3>Text Styling</h3>
          <ul>
            <li><code>font-family</code> - Font choice</li>
            <li><code>font-size</code> - Text size</li>
            <li><code>font-weight</code> - Bold (100-900)</li>
            <li><code>text-align</code> - left, center, right</li>
            <li><code>line-height</code> - Space between lines</li>
          </ul>
          
          <h3>Layout and Spacing</h3>
          <ul>
            <li><code>width / height</code> - Element dimensions</li>
            <li><code>margin</code> - Outer spacing</li>
            <li><code>padding</code> - Inner spacing</li>
            <li><code>display</code> - block, inline, flex, grid</li>
            <li><code>position</code> - static, relative, absolute, fixed</li>
          </ul>
          
          <h2>🔥 Example: Styled Card</h2>
          <pre><code>.card {
  width: 300px;
  padding: 20px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  line-height: 1.6;
}</code></pre>
          
          <h2>📱 Responsive Design</h2>
          <pre><code>/* Mobile First */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 1000px; }
}</code></pre>
          
          <h2>🚀 Modern CSS Features</h2>
          <ul>
            <li><strong>Flexbox</strong> - One-dimensional layouts</li>
            <li><strong>Grid</strong> - Two-dimensional layouts</li>
            <li><strong>Variables</strong> - Custom properties (--color-primary)</li>
            <li><strong>Transitions</strong> - Smooth animations</li>
            <li><strong>Transform</strong> - Rotate, scale, translate</li>
          </ul>
        `, 
        duration: 20, 
        xpReward: 60, 
        pointsReward: 12, 
        difficulty: 'beginner' 
      },
      { 
        title: 'JavaScript Basics', 
        course: courses[0]._id, 
        order: 3, 
        contentType: 'text', 
        content: `
          <h1>⚡ JavaScript Basics</h1>
          
          <h2>What is JavaScript?</h2>
          <p><strong>JavaScript</strong> is a programming language that makes web pages interactive. It's the only programming language that runs natively in web browsers.</p>
          
          <h2>🎯 Variables and Data Types</h2>
          <h3>Declaring Variables</h3>
          <pre><code>// Modern JavaScript (ES6+)
let age = 25;          // Can be reassigned
const name = "Alex";   // Cannot be reassigned
var old = "avoid";     // Old way (avoid)

// Data Types
let number = 42;              // Number
let string = "Hello";         // String
let boolean = true;           // Boolean
let array = [1, 2, 3];        // Array
let object = {key: "value"};  // Object
let nothing = null;           // Null
let notDefined = undefined;   // Undefined</code></pre>
          
          <h2>🔧 Operators</h2>
          <h3>Arithmetic</h3>
          <pre><code>let sum = 5 + 3;      // 8
let diff = 10 - 4;    // 6
let product = 3 * 4;  // 12
let quotient = 20 / 5;// 4
let remainder = 10 % 3;// 1</code></pre>
          
          <h3>Comparison</h3>
          <pre><code>5 === 5    // true (strict equality)
5 == "5"   // true (loose equality)
5 !== 3    // true (not equal)
10 > 5     // true
3 <= 3     // true</code></pre>
          
          <h3>Logical</h3>
          <pre><code>true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)</code></pre>
          
          <h2>🎮 Control Flow</h2>
          <h3>If-Else Statements</h3>
          <pre><code>let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Grade: C");
}</code></pre>
          
          <h3>Loops</h3>
          <pre><code>// For loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// While loop
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}

// For...of (arrays)
let fruits = ["apple", "banana"];
for (let fruit of fruits) {
  console.log(fruit);
}</code></pre>
          
          <h2>🔨 Functions</h2>
          <h3>Function Declaration</h3>
          <pre><code>function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alex")); // "Hello, Alex!"</code></pre>
          
          <h3>Arrow Functions (Modern)</h3>
          <pre><code>const add = (a, b) => a + b;
const square = x => x * x;

console.log(add(5, 3));  // 8
console.log(square(4));  // 16</code></pre>
          
          <h2>📚 Arrays</h2>
          <pre><code>let numbers = [1, 2, 3, 4, 5];

// Common methods
numbers.push(6);         // Add to end
numbers.pop();           // Remove from end
numbers.shift();         // Remove from start
numbers.unshift(0);      // Add to start

// Modern array methods
let doubled = numbers.map(n => n * 2);
let evens = numbers.filter(n => n % 2 === 0);
let sum = numbers.reduce((acc, n) => acc + n, 0);</code></pre>
          
          <h2>🎯 Objects</h2>
          <pre><code>const person = {
  name: "Alex",
  age: 25,
  skills: ["JavaScript", "React"],
  greet() {
    return "Hi, I'm " + this.name;
  }
};

console.log(person.name);     // "Alex"
console.log(person.greet());  // "Hi, I'm Alex"

// Destructuring
const {name, age} = person;
console.log(name); // "Alex"</code></pre>
          
          <h2>🌐 DOM Manipulation</h2>
          <pre><code>// Select elements
const element = document.querySelector(".class");
const elements = document.querySelectorAll("div");

// Modify content
element.textContent = "New text";
element.innerHTML = "<strong>Bold</strong>";

// Change styles
element.style.color = "blue";
element.classList.add("active");

// Event listeners
element.addEventListener("click", () => {
  console.log("Clicked!");
});</code></pre>
          
          <h2>🚀 Modern JavaScript (ES6+)</h2>
          <ul>
            <li><strong>Template Literals:</strong> \`Hello \${name}\`</li>
            <li><strong>Spread Operator:</strong> [...array]</li>
            <li><strong>Destructuring:</strong> const {a, b} = object</li>
            <li><strong>Promises:</strong> Async operations</li>
            <li><strong>Async/Await:</strong> Cleaner async code</li>
          </ul>
        `, 
        duration: 25, 
        xpReward: 75, 
        pointsReward: 15, 
        difficulty: 'intermediate' 
      },
      { 
        title: 'React.js Introduction', 
        course: courses[0]._id, 
        order: 4, 
        contentType: 'text', 
        content: `
          <h1>⚛️ React.js Introduction</h1>
          
          <h2>What is React?</h2>
          <p><strong>React</strong> is a JavaScript library for building user interfaces. Created by Facebook (Meta), it uses a component-based architecture and virtual DOM for efficient updates.</p>
          
          <h2>🎯 Why React?</h2>
          <ul>
            <li>✅ <strong>Component-Based:</strong> Reusable UI pieces</li>
            <li>✅ <strong>Virtual DOM:</strong> Fast performance</li>
            <li>✅ <strong>Declarative:</strong> Describe UI, React handles updates</li>
            <li>✅ <strong>Large Ecosystem:</strong> Huge community and libraries</li>
            <li>✅ <strong>React Native:</strong> Build mobile apps too!</li>
          </ul>
          
          <h2>🔧 Setup React</h2>
          <pre><code># Create new React app
npx create-react-app my-app
cd my-app
npm start</code></pre>
          
          <h2>📦 React Components</h2>
          <h3>Function Component (Modern)</h3>
          <pre><code>function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Arrow function
const Welcome = ({name}) => {
  return <h1>Hello, {name}!</h1>;
};</code></pre>
          
          <h3>Using Components</h3>
          <pre><code>function App() {
  return (
    <div>
      <Welcome name="Alex" />
      <Welcome name="Sarah" />
    </div>
  );
}</code></pre>
          
          <h2>🎨 JSX Syntax</h2>
          <p>JSX looks like HTML but it's JavaScript. Key differences:</p>
          <pre><code>// JSX Rules
const element = (
  <div className="container">  {/* className not class */}
    <h1>Title</h1>
    <p>Use camelCase for attributes</p>
    <img src="pic.jpg" alt="description" />  {/* Self-closing */}
    {/* JavaScript expressions in {curly braces} */}
    <p>{2 + 2}</p>  {/* Shows: 4 */}
  </div>
);</code></pre>
          
          <h2>⚡ State with useState</h2>
          <pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}</code></pre>
          
          <h2>🎯 Props (Properties)</h2>
          <pre><code>function UserCard({name, age, email}) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Usage
<UserCard name="Alex" age={25} email="alex@example.com" /></code></pre>
          
          <h2>🔄 Conditional Rendering</h2>
          <pre><code>function Greeting({isLoggedIn}) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}

// Ternary operator
function Status({isOnline}) {
  return (
    <div>
      {isOnline ? <span>🟢 Online</span> : <span>⚫ Offline</span>}
    </div>
  );
}</code></pre>
          
          <h2>📋 Rendering Lists</h2>
          <pre><code>function TodoList() {
  const todos = ["Learn React", "Build app", "Deploy"];
  
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}</code></pre>
          
          <h2>🎮 Event Handling</h2>
          <pre><code>function Form() {
  const [name, setName] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Hello, ' + name + '!');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button type="submit">Submit</button>
    </form>
  );
}</code></pre>
          
          <h2>🔥 useEffect Hook</h2>
          <pre><code>import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Runs after component mounts
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => setData(data));
    
    // Cleanup function
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty array = run once
  
  return <div>{data ? data.title : "Loading..."}</div>;
}</code></pre>
          
          <h2>🚀 React Best Practices</h2>
          <ul>
            <li>✅ Keep components small and focused</li>
            <li>✅ Use functional components with hooks</li>
            <li>✅ Always provide keys in lists</li>
            <li>✅ Don't mutate state directly</li>
            <li>✅ Use prop destructuring for clarity</li>
            <li>✅ Split large components into smaller ones</li>
          </ul>
        `, 
        duration: 30, 
        xpReward: 100, 
        pointsReward: 20, 
        difficulty: 'intermediate' 
      },
      { 
        title: 'Building Your First React App', 
        course: courses[0]._id, 
        order: 5, 
        contentType: 'text', 
        content: `
          <h1>🚀 Building Your First React App</h1>
          
          <h2>Project: Todo List Application</h2>
          <p>Let's build a complete todo list app with add, delete, and mark complete functionality!</p>
          
          <h2>📁 Project Structure</h2>
          <pre><code>src/
├── App.js
├── components/
│   ├── TodoList.js
│   ├── TodoItem.js
│   └── TodoForm.js
├── styles/
│   └── App.css
└── index.js</code></pre>
          
          <h2>1️⃣ App.js - Main Component</h2>
          <pre><code>import { useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './styles/App.css';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build an app", completed: false }
  ]);
  
  // Add new todo
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };
  
  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div className="app">
      <h1>📝 My Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList 
        todos={todos} 
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
      />
      <div className="stats">
        <p>Total: {todos.length}</p>
        <p>Completed: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  );
}

export default App;</code></pre>
          
          <h2>2️⃣ TodoForm.js - Input Form</h2>
          <pre><code>import { useState } from 'react';

function TodoForm({ addTodo }) {
  const [input, setInput] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput(""); // Clear input
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo..."
        className="todo-input"
      />
      <button type="submit" className="add-button">
        ➕ Add
      </button>
    </form>
  );
}

export default TodoForm;</code></pre>
          
          <h2>3️⃣ TodoList.js - List Container</h2>
          <pre><code>import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  if (todos.length === 0) {
    return <p className="empty">No todos yet! Add one above.</p>;
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;</code></pre>
          
          <h2>4️⃣ TodoItem.js - Individual Todo</h2>
          <pre><code>function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li className={'todo-item' + (todo.completed ? ' completed' : '')}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <button 
        onClick={() => deleteTodo(todo.id)}
        className="delete-button"
      >
        🗑️
      </button>
    </li>
  );
}

export default TodoItem;</code></pre>
          
          <h2>5️⃣ App.css - Styling</h2>
          <pre><code>.app {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.add-button {
  padding: 12px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background: #45a049;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: white;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: all 0.3s;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}

.todo-text {
  flex: 1;
  font-size: 16px;
}

.delete-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
}

.empty {
  text-align: center;
  color: #888;
  padding: 20px;
}</code></pre>
          
          <h2>🎯 Key Concepts Applied</h2>
          <ul>
            <li>✅ <strong>State Management:</strong> useState hook for todos</li>
            <li>✅ <strong>Props:</strong> Passing data between components</li>
            <li>✅ <strong>Event Handling:</strong> onClick, onChange, onSubmit</li>
            <li>✅ <strong>Conditional Rendering:</strong> Empty state message</li>
            <li>✅ <strong>List Rendering:</strong> map() with unique keys</li>
            <li>✅ <strong>Component Composition:</strong> Breaking into smaller parts</li>
          </ul>
          
          <h2>🚀 Enhancement Ideas</h2>
          <ul>
            <li>📱 Add localStorage to persist todos</li>
            <li>🔍 Add filter (All, Active, Completed)</li>
            <li>✏️ Add edit functionality</li>
            <li>🎨 Add drag-and-drop reordering</li>
            <li>📅 Add due dates and priority</li>
            <li>🌓 Add dark mode toggle</li>
          </ul>
          
          <h2>🎓 What You Learned</h2>
          <p>Congratulations! You've built a complete React application from scratch. You now understand:</p>
          <ul>
            <li>Component structure and organization</li>
            <li>State management with hooks</li>
            <li>Props and data flow</li>
            <li>Event handling in React</li>
            <li>Conditional and list rendering</li>
            <li>Basic styling with CSS</li>
          </ul>
          
          <h2>✨ Next Steps</h2>
          <p>Continue learning advanced React concepts:</p>
          <ul>
            <li>Context API for global state</li>
            <li>React Router for navigation</li>
            <li>API integration with fetch/axios</li>
            <li>Custom hooks</li>
            <li>Performance optimization</li>
          </ul>
        `, 
        duration: 45, 
        xpReward: 150, 
        pointsReward: 30, 
        difficulty: 'advanced' 
      },
    ]);
    await Course.findByIdAndUpdate(courses[0]._id, { modules: course0Lessons.map(l => l._id) });
    allLessons.push(...course0Lessons);

    // Course 1: Machine Learning with Python
    const course1Lessons = await Lesson.insertMany([
      { 
        title: 'Introduction to Machine Learning', 
        course: courses[1]._id, 
        order: 1, 
        contentType: 'text', 
        content: `
          <h1>🤖 Introduction to Machine Learning</h1>
          
          <h2>What is Machine Learning?</h2>
          <p><strong>Machine Learning (ML)</strong> is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. Instead of writing rules, we train models on data.</p>
          
          <h2>🎯 Types of Machine Learning</h2>
          
          <h3>1. Supervised Learning</h3>
          <p>Learn from labeled data (input-output pairs)</p>
          <ul>
            <li><strong>Classification:</strong> Predict categories (spam/not spam, cat/dog)</li>
            <li><strong>Regression:</strong> Predict continuous values (house prices, temperature)</li>
          </ul>
          <p><em>Examples:</em> Email spam detection, house price prediction, image recognition</p>
          
          <h3>2. Unsupervised Learning</h3>
          <p>Find patterns in unlabeled data</p>
          <ul>
            <li><strong>Clustering:</strong> Group similar items (customer segmentation)</li>
            <li><strong>Dimensionality Reduction:</strong> Reduce features while keeping info</li>
          </ul>
          <p><em>Examples:</em> Customer segmentation, anomaly detection, recommendation systems</p>
          
          <h3>3. Reinforcement Learning</h3>
          <p>Learn through trial and error with rewards</p>
          <p><em>Examples:</em> Game AI, robotics, self-driving cars</p>
          
          <h2>📊 ML Workflow</h2>
          <pre><code>1. Define Problem → What are we predicting?
2. Collect Data → Gather relevant dataset
3. Prepare Data → Clean, normalize, split
4. Choose Model → Select algorithm
5. Train Model → Feed data to learn patterns
6. Evaluate Model → Test accuracy and performance
7. Deploy Model → Use in production
8. Monitor & Update → Continuous improvement</code></pre>
          
          <h2>🔑 Key ML Terminology</h2>
          <ul>
            <li><strong>Features (X):</strong> Input variables used for prediction</li>
            <li><strong>Labels (y):</strong> Output we want to predict</li>
            <li><strong>Training Set:</strong> Data used to train the model (80%)</li>
            <li><strong>Test Set:</strong> Data used to evaluate model (20%)</li>
            <li><strong>Model:</strong> Mathematical representation of patterns</li>
            <li><strong>Overfitting:</strong> Model memorizes training data but fails on new data</li>
            <li><strong>Underfitting:</strong> Model too simple to capture patterns</li>
          </ul>
          
          <h2>🛠️ Popular ML Algorithms</h2>
          <ul>
            <li><strong>Linear Regression:</strong> Predict continuous values</li>
            <li><strong>Logistic Regression:</strong> Binary classification</li>
            <li><strong>Decision Trees:</strong> Tree-based decisions</li>
            <li><strong>Random Forest:</strong> Ensemble of decision trees</li>
            <li><strong>SVM:</strong> Find optimal decision boundary</li>
            <li><strong>K-Nearest Neighbors:</strong> Classify based on nearest examples</li>
            <li><strong>Neural Networks:</strong> Deep learning models</li>
          </ul>
          
          <h2>📚 Essential Python Libraries</h2>
          <ul>
            <li><strong>NumPy:</strong> Numerical computing with arrays</li>
            <li><strong>Pandas:</strong> Data manipulation and analysis</li>
            <li><strong>Scikit-learn:</strong> Machine learning algorithms</li>
            <li><strong>TensorFlow/PyTorch:</strong> Deep learning frameworks</li>
            <li><strong>Matplotlib/Seaborn:</strong> Data visualization</li>
          </ul>
          
          <h2>💡 Simple ML Example</h2>
          <pre><code># Predict house prices based on size
from sklearn.linear_model import LinearRegression

# Data: house size (sq ft) and prices
X = [[1000], [1500], [2000], [2500]]  # Features
y = [200000, 300000, 400000, 500000]   # Labels

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Predict price for 1800 sq ft house
prediction = model.predict([[1800]])
print(f"Predicted price: \\$\\{prediction[0]:,.0f}")</code></pre>
          
          <h2>🎯 Real-World Applications</h2>
          <ul>
            <li>🏥 <strong>Healthcare:</strong> Disease diagnosis, drug discovery</li>
            <li>💰 <strong>Finance:</strong> Fraud detection, stock prediction</li>
            <li>🛒 <strong>E-commerce:</strong> Product recommendations, price optimization</li>
            <li>🚗 <strong>Autonomous Vehicles:</strong> Object detection, path planning</li>
            <li>🎵 <strong>Entertainment:</strong> Content recommendations (Netflix, Spotify)</li>
            <li>📧 <strong>Email:</strong> Spam filtering, smart replies</li>
          </ul>
          
          <h2>🚀 Why Learn ML?</h2>
          <ul>
            <li>✅ High demand career opportunities</li>
            <li>✅ Solve complex real-world problems</li>
            <li>✅ Automate decision-making</li>
            <li>✅ Extract insights from big data</li>
            <li>✅ Build intelligent applications</li>
          </ul>`,
        duration: 20, 
        xpReward: 60, 
        pointsReward: 15, 
        difficulty: 'beginner' 
      },
      { 
        title: 'Python for Data Science', 
        course: courses[1]._id, 
        order: 2, 
        contentType: 'text', 
        content: `
          <h1>🐍 Python for Data Science</h1>
          
          <h2>Why Python for ML?</h2>
          <ul>
            <li>✅ Easy to learn and read</li>
            <li>✅ Rich ecosystem of libraries</li>
            <li>✅ Large community support</li>
            <li>✅ Industry standard for ML</li>
            <li>✅ Excellent for data manipulation</li>
          </ul>
          
          <h2>📦 Essential Libraries</h2>
          
          <h3>NumPy - Numerical Computing</h3>
          <pre><code>import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Array operations
print(arr * 2)        # [2, 4, 6, 8, 10]
print(arr.mean())     # 3.0
print(arr.max())      # 5

# Matrix operations
print(matrix.T)       # Transpose
print(matrix.shape)   # (2, 2)

# Create special arrays
zeros = np.zeros((3, 3))
ones = np.ones((2, 4))
random = np.random.rand(5)     # Random [0, 1)
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]</code></pre>
          
          <h3>Pandas - Data Manipulation</h3>
          <pre><code>import pandas as pd

# Create DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'salary': [50000, 60000, 70000]
}
df = pd.DataFrame(data)

# Basic operations
print(df.head())           # First 5 rows
print(df.describe())       # Statistics
print(df['age'].mean())    # 30.0

# Filter data
young = df[df['age'] < 30]

# Group and aggregate
avg_salary = df.groupby('age')['salary'].mean()

# Read/Write files
df = pd.read_csv('data.csv')
df.to_csv('output.csv', index=False)

# Handle missing data
df.fillna(0)               # Fill NaN with 0
df.dropna()                # Remove NaN rows</code></pre>
          
          <h3>Matplotlib - Visualization</h3>
          <pre><code>import matplotlib.pyplot as plt

# Line plot
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
plt.plot(x, y, marker='o')
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('Simple Line Plot')
plt.show()

# Bar chart
categories = ['A', 'B', 'C']
values = [10, 15, 7]
plt.bar(categories, values)
plt.show()

# Histogram
data = np.random.randn(1000)
plt.hist(data, bins=30)
plt.show()

# Scatter plot
x = np.random.rand(50)
y = np.random.rand(50)
plt.scatter(x, y)
plt.show()</code></pre>
          
          <h3>Scikit-learn - Machine Learning</h3>
          <pre><code>from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Prepare data
X = [[1], [2], [3], [4], [5]]
y = [2, 4, 6, 8, 10]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE: {mse}")
print(f"R² Score: {r2}")</code></pre>
          
          <h2>🔧 Data Preprocessing</h2>
          
          <h3>Handling Missing Data</h3>
          <pre><code>from sklearn.impute import SimpleImputer

# Fill missing values with mean
imputer = SimpleImputer(strategy='mean')
X_filled = imputer.fit_transform(X)</code></pre>
          
          <h3>Feature Scaling</h3>
          <pre><code>from sklearn.preprocessing import StandardScaler

# Standardize features (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)</code></pre>
          
          <h3>Encoding Categorical Data</h3>
          <pre><code>from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Label encoding (ordinal)
le = LabelEncoder()
labels = le.fit_transform(['red', 'blue', 'green'])

# One-hot encoding (nominal)
ohe = OneHotEncoder()
encoded = ohe.fit_transform([['red'], ['blue'], ['green']])</code></pre>
          
          <h2>📊 Real Example: House Price Prediction</h2>
          <pre><code>import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import matplotlib.pyplot as plt

# Load data
df = pd.DataFrame({
    'size': [1000, 1500, 2000, 2500, 3000],
    'bedrooms': [2, 3, 3, 4, 4],
    'price': [200000, 300000, 400000, 500000, 600000]
})

# Features and target
X = df[['size', 'bedrooms']]
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error: \${mae:,.0f}")

# Visualize
plt.scatter(y_test, y_pred)
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--')
plt.xlabel('Actual Price')
plt.ylabel('Predicted Price')
plt.title('Actual vs Predicted')
plt.show()</code></pre>
          
          <h2>🎯 Best Practices</h2>
          <ul>
            <li>✅ Always explore data first (df.info(), df.describe())</li>
            <li>✅ Handle missing values before training</li>
            <li>✅ Scale features when needed</li>
            <li>✅ Split data into train/test sets</li>
            <li>✅ Use cross-validation for better evaluation</li>
            <li>✅ Visualize data and results</li>
          </ul>`,
        duration: 30, 
        xpReward: 80, 
        pointsReward: 20, 
        difficulty: 'intermediate' 
      },
      { 
        title: 'Supervised Learning Algorithms', 
        course: courses[1]._id, 
        order: 3, 
        contentType: 'text', 
        content: `
          <h1>🎯 Supervised Learning Algorithms</h1>
          
          <h2>What is Supervised Learning?</h2>
          <p>Supervised learning uses <strong>labeled data</strong> (input-output pairs) to train models that can predict outputs for new inputs.</p>
          
          <h2>📊 Regression Algorithms</h2>
          <p>Predict <strong>continuous values</strong> (numbers)</p>
          
          <h3>1. Linear Regression</h3>
          <p>Find best-fit line: y = mx + b</p>
          <pre><code>from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Get coefficients
print(f"Slope: {model.coef_}")
print(f"Intercept: {model.intercept_}")</code></pre>
          <p><strong>Use cases:</strong> House prices, sales forecasting, temperature prediction</p>
          
          <h3>2. Polynomial Regression</h3>
          <p>Fit curved lines for non-linear relationships</p>
          <pre><code>from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Create polynomial features (degree=2)
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

model = LinearRegression()
model.fit(X_poly, y)</code></pre>
          
          <h3>3. Ridge & Lasso Regression</h3>
          <p>Regularized regression to prevent overfitting</p>
          <pre><code>from sklearn.linear_model import Ridge, Lasso

# Ridge (L2 regularization)
ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)

# Lasso (L1 regularization)
lasso = Lasso(alpha=0.1)
lasso.fit(X_train, y_train)</code></pre>
          
          <h2>🏷️ Classification Algorithms</h2>
          <p>Predict <strong>categories</strong> or <strong>classes</strong></p>
          
          <h3>1. Logistic Regression</h3>
          <p>Binary classification (0 or 1, yes or no)</p>
          <pre><code>from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)

# Predict class
predictions = model.predict(X_test)

# Predict probabilities
probabilities = model.predict_proba(X_test)</code></pre>
          <p><strong>Use cases:</strong> Spam detection, disease diagnosis, loan approval</p>
          
          <h3>2. Decision Trees</h3>
          <p>Tree-based decisions using if-else rules</p>
          <pre><code>from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=5)
model.fit(X_train, y_train)

# Visualize tree
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(model, filled=True)
plt.show()</code></pre>
          <p><strong>Pros:</strong> Easy to interpret, handles non-linear data<br>
          <strong>Cons:</strong> Prone to overfitting</p>
          
          <h3>3. Random Forest</h3>
          <p>Ensemble of decision trees (voting system)</p>
          <pre><code>from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Feature importance
importances = model.feature_importances_
print("Feature importance:", importances)</code></pre>
          <p><strong>Pros:</strong> Highly accurate, reduces overfitting<br>
          <strong>Use cases:</strong> Credit scoring, image classification</p>
          
          <h3>4. Support Vector Machines (SVM)</h3>
          <p>Find optimal decision boundary (hyperplane)</p>
          <pre><code>from sklearn.svm import SVC

# Linear kernel
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# RBF kernel (non-linear)
model_rbf = SVC(kernel='rbf', gamma='auto')
model_rbf.fit(X_train, y_train)</code></pre>
          <p><strong>Use cases:</strong> Text classification, face detection</p>
          
          <h3>5. K-Nearest Neighbors (KNN)</h3>
          <p>Classify based on K nearest examples</p>
          <pre><code>from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

predictions = model.predict(X_test)</code></pre>
          <p><strong>Pros: </strong>Simple, no training phase<br>
          <strong>Cons:</strong> Slow for large datasets</p>
          
          <h3>6. Naive Bayes</h3>
          <p>Probabilistic classifier based on Bayes theorem</p>
          <pre><code>from sklearn.naive_bayes import GaussianNB

model = GaussianNB()
model.fit(X_train, y_train)</code></pre>
          <p><strong>Use cases:</strong> Text classification, spam filtering</p>
          
          <h2>📏 Model Evaluation Metrics</h2>
          
          <h3>Regression Metrics</h3>
          <pre><code>from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# Mean Squared Error
mse = mean_squared_error(y_test, y_pred)

# Root Mean Squared Error
rmse = np.sqrt(mse)

# Mean Absolute Error
mae = mean_absolute_error(y_test, y_pred)

# R² Score (0-1, higher is better)
r2 = r2_score(y_test, y_pred)</code></pre>
          
          <h3>Classification Metrics</h3>
          <pre><code>from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Accuracy (correct predictions / total)
accuracy = accuracy_score(y_test, y_pred)

# Precision (true positives / predicted positives)
precision = precision_score(y_test, y_pred)

# Recall (true positives / actual positives)
recall = recall_score(y_test, y_pred)

# F1 Score (harmonic mean of precision and recall)
f1 = f1_score(y_test, y_pred)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(cm)</code></pre>
          
          <h2>🔄 Cross-Validation</h2>
          <pre><code>from sklearn.model_selection import cross_val_score

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5)

print(f"Scores: {scores}")
print(f"Mean: {scores.mean()}")
print(f"Std: {scores.std()}")</code></pre>
          
          <h2>🎯 Complete Example: Iris Classification</h2>
          <pre><code>from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))</code></pre>
          
          <h2>🏆 Algorithm Selection Guide</h2>
          <ul>
            <li><strong>Linear data:</strong> Linear/Logistic Regression</li>
            <li><strong>Non-linear data:</strong> Decision Trees, Random Forest, SVM</li>
            <li><strong>Large dataset:</strong> Logistic Regression, SVM</li>
            <li><strong>Small dataset:</strong> Naive Bayes, KNN</li>
            <li><strong>Need interpretability:</strong> Decision Trees, Linear Regression</li>
            <li><strong>Need highest accuracy:</strong> Random Forest, Gradient Boosting</li>
          </ul>`,
        duration: 40, 
        xpReward: 120, 
        pointsReward: 30, 
        difficulty: 'intermediate' 
      },
      { 
        title: 'Neural Networks Fundamentals', 
        course: courses[1]._id, 
        order: 4, 
        contentType: 'text', 
        content: `
          <h1>🧠 Neural Networks Fundamentals</h1>
          
          <h2>What are Neural Networks?</h2>
          <p><strong>Neural Networks</strong> are computing systems inspired by biological brains. They consist of interconnected nodes (neurons) that process information through layers.</p>
          
          <h2>🏗️ Architecture Components</h2>
          
          <h3>1. Neurons (Nodes)</h3>
          <p>Basic processing units that:</p>
          <ul>
            <li>Receive inputs (x₁, x₂, x₃, ...)</li>
            <li>Multiply by weights (w₁, w₂, w₃, ...)</li>
            <li>Add bias (b)</li>
            <li>Apply activation function</li>
            <li>Output result</li>
          </ul>
          <p><strong>Formula:</strong> output = activation(Σ(weights × inputs) + bias)</p>
          
          <h3>2. Layers</h3>
          <ul>
            <li><strong>Input Layer:</strong> Receives raw data</li>
            <li><strong>Hidden Layers:</strong> Process and transform data</li>
            <li><strong>Output Layer:</strong> Produces final prediction</li>
          </ul>
          
          <h3>3. Weights and Biases</h3>
          <p>Parameters learned during training:</p>
          <ul>
            <li><strong>Weights:</strong> Importance of each connection</li>
            <li><strong>Biases:</strong> Adjust output threshold</li>
          </ul>
          
          <h2>⚡ Activation Functions</h2>
          
          <h3>1. Sigmoid</h3>
          <p>S-shaped curve, outputs between 0 and 1</p>
          <p>Formula: σ(x) = 1 / (1 + e<sup>-x</sup>)</p>
          <p><strong>Use:</strong> Binary classification output layer</p>
          
          <h3>2. ReLU (Rectified Linear Unit)</h3>
          <p>Most popular in hidden layers</p>
          <p>Formula: f(x) = max(0, x)</p>
          <p><strong>Pros:</strong> Fast, prevents vanishing gradients</p>
          
          <h3>3. Tanh (Hyperbolic Tangent)</h3>
          <p>Outputs between -1 and 1</p>
          <p>Formula: tanh(x) = (e<sup>x</sup> - e<sup>-x</sup>) / (e<sup>x</sup> + e<sup>-x</sup>)</p>
          
          <h3>4. Softmax</h3>
          <p>Multi-class classification output</p>
          <p>Outputs probabilities that sum to 1</p>
          
          <h2>🎓 How Neural Networks Learn</h2>
          
          <h3>1. Forward Propagation</h3>
          <p>Pass inputs through network to get prediction</p>
          <pre><code>Input → Layer 1 → Layer 2 → ... → Output</code></pre>
          
          <h3>2. Calculate Loss</h3>
          <p>Measure error between prediction and actual value</p>
          <ul>
            <li><strong>MSE (Regression):</strong> Mean Squared Error</li>
            <li><strong>Cross-Entropy (Classification):</strong> Log loss</li>
          </ul>
          
          <h3>3. Backpropagation</h3>
          <p>Calculate gradients of loss with respect to weights</p>
          <p>Propagate error backwards through network</p>
          
          <h3>4. Update Weights</h3>
          <p>Adjust weights to reduce loss</p>
          <p>Formula: weight_new = weight_old - learning_rate × gradient</p>
          
          <h2>🔧 Building Neural Networks with Keras</h2>
          
          <h3>Simple Neural Network</h3>
          <pre><code>import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Create model
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(10,)),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# Compile
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2
)

# Predict
predictions = model.predict(X_test)</code></pre>
          
          <h3>Multi-Class Classification</h3>
          <pre><code>model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),  # Prevent overfitting
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')  # 10 classes
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=10, batch_size=128)</code></pre>
          
          <h2>📊 Hyperparameters</h2>
          
          <ul>
            <li><strong>Learning Rate:</strong> Step size for updates (0.001 - 0.1)</li>
            <li><strong>Batch Size:</strong> Samples per weight update (32, 64, 128)</li>
            <li><strong>Epochs:</strong> Complete passes through dataset</li>
            <li><strong>Number of Layers:</strong> Network depth</li>
            <li><strong>Neurons per Layer:</strong> Network width</li>
            <li><strong>Dropout Rate:</strong> Regularization (0.2 - 0.5)</li>
          </ul>
          
          <h2>🎯 Optimization Algorithms</h2>
          
          <h3>1. SGD (Stochastic Gradient Descent)</h3>
          <pre><code>optimizer = keras.optimizers.SGD(learning_rate=0.01)</code></pre>
          
          <h3>2. Adam (Adaptive Moment Estimation)</h3>
          <pre><code>optimizer = keras.optimizers.Adam(learning_rate=0.001)</code></pre>
          <p><strong>Most popular!</strong> Adapts learning rate automatically</p>
          
          <h3>3. RMSprop</h3>
          <pre><code>optimizer = keras.optimizers.RMSprop(learning_rate=0.001)</code></pre>
          
          <h2>🛡️ Regularization Techniques</h2>
          
          <h3>1. Dropout</h3>
          <pre><code>layers.Dropout(0.3)  # Drop 30% of neurons randomly</code></pre>
          
          <h3>2. L1/L2 Regularization</h3>
          <pre><code>from tensorflow.keras import regularizers

layers.Dense(
    64, 
    activation='relu',
    kernel_regularizer=regularizers.l2(0.01)
)</code></pre>
          
          <h3>3. Early Stopping</h3>
          <pre><code>from tensorflow.keras.callbacks import EarlyStopping

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

model.fit(X_train, y_train, callbacks=[early_stop])</code></pre>
          
          <h2>📈 Monitoring Training</h2>
          <pre><code>import matplotlib.pyplot as plt

# Plot training history
plt.plot(history.history['accuracy'], label='train accuracy')
plt.plot(history.history['val_accuracy'], label='val accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='train loss')
plt.plot(history.history['val_loss'], label='val loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.show()</code></pre>
          
          <h2>🏆 Complete Example: MNIST Digit Recognition</h2>
          <pre><code>import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Load data
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# Preprocess
X_train = X_train.reshape(-1, 784) / 255.0
X_test = X_test.reshape(-1, 784) / 255.0

# Build model
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=128,
    validation_split=0.2
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc * 100:.2f}%")</code></pre>
          
          <h2>🚀 Best Practices</h2>
          <ul>
            <li>✅ Normalize/standardize input data</li>
            <li>✅ Start with simple architecture, then increase complexity</li>
            <li>✅ Use ReLU activation for hidden layers</li>
            <li>✅ Use Adam optimizer (good default)</li>
            <li>✅ Add dropout to prevent overfitting</li>
            <li>✅ Monitor validation loss to detect overfitting</li>
            <li>✅ Use callbacks (EarlyStopping, ModelCheckpoint)</li>
          </ul>`,
        duration: 45, 
        xpReward: 150, 
        pointsReward: 35, 
        difficulty: 'advanced' 
      },
      { 
        title: 'Building ML Models with TensorFlow', 
        course: courses[1]._id, 
        order: 5, 
        contentType: 'text', 
        content: `
          <h1>🔥 Building ML Models with TensorFlow</h1>
          
          <h2>What is TensorFlow?</h2>
          <p><strong>TensorFlow</strong> is an open-source deep learning framework developed by Google. It's the industry standard for building and deploying ML models at scale.</p>
          
          <h2>🎯 Why TensorFlow?</h2>
          <ul>
            <li>✅ Production-ready and scalable</li>
            <li>✅ Works on CPU, GPU, and TPU</li>
            <li>✅ Deploy on mobile, web, and servers</li>
            <li>✅ Keras integration (high-level API)</li>
            <li>✅ Large community and ecosystem</li>
          </ul>
          
          <h2>🚀 Installation</h2>
          <pre><code># Install TensorFlow
pip install tensorflow

# Verify installation
import tensorflow as tf
print(tf.__version__)
print("GPU Available:", tf.config.list_physical_devices('GPU'))</code></pre>
          
          <h2>📦 Project: Image Classification with CNN</h2>
          
          <h3>Complete CIFAR-10 Classification</h3>
          <pre><code>import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt

# 1. Load and preprocess data
(X_train, y_train), (X_test, y_test) = keras.datasets.cifar10.load_data()

# Normalize pixel values to [0, 1]
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

# Class names
class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

print(f"Training samples: {X_train.shape[0]}")
print(f"Test samples: {X_test.shape[0]}")
print(f"Image shape: {X_train.shape[1:]}")

# 2. Build CNN model
model = keras.Sequential([
    # Convolutional Block 1
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    # Convolutional Block 2
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    # Convolutional Block 3
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.25),
    
    # Dense Layers
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

# 3. Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Model summary
model.summary()

# 4. Set up callbacks
callbacks = [
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=0.00001
    ),
    keras.callbacks.ModelCheckpoint(
        'best_model.h5',
        monitor='val_accuracy',
        save_best_only=True
    )
]

# 5. Train model
history = model.fit(
    X_train, y_train,
    batch_size=128,
    epochs=50,
    validation_split=0.2,
    callbacks=callbacks,
    verbose=1
)

# 6. Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"\\nTest accuracy: {test_acc * 100:.2f}%")

# 7. Visualize training
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Val Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

# 8. Make predictions
predictions = model.predict(X_test[:10])
predicted_classes = np.argmax(predictions, axis=1)

# Visualize predictions
plt.figure(figsize=(15, 3))
for i in range(10):
    plt.subplot(1, 10, i + 1)
    plt.imshow(X_test[i])
    plt.title(f"{class_names[predicted_classes[i]]}\\n{class_names[y_test[i][0]]}")
    plt.axis('off')
plt.tight_layout()
plt.show()</code></pre>
          
          <h2>🔄 Data Augmentation</h2>
          <pre><code>from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Create data augmentation generator
datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True,
    zoom_range=0.1
)

# Fit generator on training data
datagen.fit(X_train)

# Train with augmented data
history = model.fit(
    datagen.flow(X_train, y_train, batch_size=128),
    epochs=50,
    validation_data=(X_test, y_test),
    callbacks=callbacks
)</code></pre>
          
          <h2>💾 Save and Load Models</h2>
          <pre><code># Save entire model
model.save('my_model.h5')
model.save('my_model')  # SavedModel format

# Load model
loaded_model = keras.models.load_model('my_model.h5')

# Save only weights
model.save_weights('model_weights.h5')

# Load weights
model.load_weights('model_weights.h5')</code></pre>
          
          <h2>📊 Transfer Learning</h2>
          <pre><code># Use pre-trained model
base_model = keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model
base_model.trainable = False

# Add custom layers
model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train only new layers
model.fit(X_train, y_train, epochs=10)

# Fine-tune: Unfreeze and train all
base_model.trainable = True
model.compile(
    optimizer=keras.optimizers.Adam(1e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.fit(X_train, y_train, epochs=10)</code></pre>
          
          <h2>🎯 Custom Training Loop</h2>
          <pre><code>import tensorflow as tf

# Define loss and optimizer
loss_fn = keras.losses.SparseCategoricalCrossentropy()
optimizer = keras.optimizers.Adam()

# Metrics
train_acc_metric = keras.metrics.SparseCategoricalAccuracy()

@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        logits = model(x, training=True)
        loss_value = loss_fn(y, logits)
    
    grads = tape.gradient(loss_value, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    
    train_acc_metric.update_state(y, logits)
    return loss_value

# Training loop
epochs = 10
for epoch in range(epochs):
    print(f"\\nEpoch {epoch + 1}/{epochs}")
    
    for step, (x_batch, y_batch) in enumerate(train_dataset):
        loss = train_step(x_batch, y_batch)
        
        if step % 100 == 0:
            print(f"Step {step}: Loss = {loss:.4f}")
    
    train_acc = train_acc_metric.result()
    print(f"Training accuracy: {train_acc:.4f}")
    train_acc_metric.reset_states()</code></pre>
          
          <h2>🚀 TensorBoard Monitoring</h2>
          <pre><code># Create TensorBoard callback
tensorboard_callback = keras.callbacks.TensorBoard(
    log_dir='./logs',
    histogram_freq=1
)

# Train with TensorBoard
history = model.fit(
    X_train, y_train,
    epochs=10,
    validation_split=0.2,
    callbacks=[tensorboard_callback]
)

# Launch TensorBoard
# In terminal: tensorboard --logdir=./logs
# Open browser: http://localhost:6006</code></pre>
          
          <h2>📱 Model Deployment</h2>
          
          <h3>Convert to TensorFlow Lite (Mobile)</h3>
          <pre><code># Convert model
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)</code></pre>
          
          <h3>Convert to TensorFlow.js (Web)</h3>
          <pre><code># Install tensorflowjs
# pip install tensorflowjs

# Convert
# tensorflowjs_converter --input_format=keras model.h5 tfjs_model/</code></pre>
          
          <h2>🏆 Best Practices</h2>
          <ul>
            <li>✅ Use data augmentation for small datasets</li>
            <li>✅ Implement early stopping to prevent overfitting</li>
            <li>✅ Use batch normalization for faster training</li>
            <li>✅ Start with pre-trained models (transfer learning)</li>
            <li>✅ Monitor training with TensorBoard</li>
            <li>✅ Save best models with ModelCheckpoint</li>
            <li>✅ Use mixed precision for faster GPU training</li>
            <li>✅ Profile model to identify bottlenecks</li>
          </ul>
          
          <h2>🎓 What You Learned</h2>
          <p>Congratulations! You can now:</p>
          <ul>
            <li>Build CNNs for image classification</li>
            <li>Apply data augmentation</li>
            <li>Use transfer learning with pre-trained models</li>
            <li>Monitor training with callbacks and TensorBoard</li>
            <li>Save and deploy models</li>
            <li>Write custom training loops</li>
          </ul>
          
          <h2>🚀 Next Steps</h2>
          <ul>
            <li>Explore RNNs for sequence data</li>
            <li>Learn GANs for image generation</li>
            <li>Study transformers for NLP</li>
            <li>Deploy models to cloud (AWS, GCP, Azure)</li>
            <li>Build production ML pipelines</li>
          </ul>`,
        duration: 50, 
        xpReward: 180, 
        pointsReward: 45, 
        difficulty: 'advanced' 
      },
    ]);
    await Course.findByIdAndUpdate(courses[1]._id, { modules: course1Lessons.map(l => l._id) });
    allLessons.push(...course1Lessons);

    // Course 2: Data Structures & Algorithms
    const course2Lessons = await Lesson.insertMany([
      { title: 'Big O Notation Explained', course: courses[2]._id, order: 1, contentType: 'text', content: '<h2>Algorithm Complexity</h2><p>Understanding time and space complexity...</p>', duration: 25, xpReward: 70, pointsReward: 15, difficulty: 'intermediate' },
      { title: 'Arrays and Linked Lists', course: courses[2]._id, order: 2, contentType: 'text', content: '<h2>Linear Data Structures</h2><p>Master arrays, linked lists, and their operations...</p>', duration: 30, xpReward: 85, pointsReward: 20, difficulty: 'intermediate' },
      { title: 'Stacks, Queues & Hash Tables', course: courses[2]._id, order: 3, contentType: 'text', content: '<h2>ADTs</h2><p>Abstract data types and their implementations...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: 'Trees and Graph Algorithms', course: courses[2]._id, order: 4, contentType: 'text', content: '<h2>Non-Linear Structures</h2><p>Binary trees, BSTs, and graph traversal...</p>', duration: 40, xpReward: 130, pointsReward: 32, difficulty: 'advanced' },
      { title: 'Dynamic Programming Mastery', course: courses[2]._id, order: 5, contentType: 'text', content: '<h2>Advanced Techniques</h2><p>Solve complex problems with DP...</p>', duration: 50, xpReward: 170, pointsReward: 42, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[2]._id, { modules: course2Lessons.map(l => l._id) });
    allLessons.push(...course2Lessons);

    // Course 3: UI/UX Design Fundamentals
    const course3Lessons = await Lesson.insertMany([
      { title: 'Design Thinking Process', course: courses[3]._id, order: 1, contentType: 'text', content: '<h2>User-Centered Design</h2><p>Learn the design thinking methodology...</p>', duration: 20, xpReward: 50, pointsReward: 12, difficulty: 'beginner' },
      { title: 'Wireframing & Prototyping', course: courses[3]._id, order: 2, contentType: 'text', content: '<h2>Low to High Fidelity</h2><p>Create wireframes and interactive prototypes...</p>', duration: 25, xpReward: 65, pointsReward: 16, difficulty: 'beginner' },
      { title: 'Color Theory & Typography', course: courses[3]._id, order: 3, contentType: 'text', content: '<h2>Visual Design Principles</h2><p>Master color schemes and font pairing...</p>', duration: 30, xpReward: 80, pointsReward: 20, difficulty: 'intermediate' },
      { title: 'Figma Professional Workflows', course: courses[3]._id, order: 4, contentType: 'text', content: '<h2>Design Tools Mastery</h2><p>Advanced Figma techniques and components...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
    ]);
    await Course.findByIdAndUpdate(courses[3]._id, { modules: course3Lessons.map(l => l._id) });
    allLessons.push(...course3Lessons);

    // Course 4: React Native Mobile Development
    const course4Lessons = await Lesson.insertMany([
      { title: 'React Native Setup & Basics', course: courses[4]._id, order: 1, contentType: 'text', content: '<h2>Getting Started</h2><p>Set up your React Native development environment...</p>', duration: 25, xpReward: 70, pointsReward: 17, difficulty: 'beginner' },
      { title: 'Core Components & Styling', course: courses[4]._id, order: 2, contentType: 'text', content: '<h2>Building UI</h2><p>Learn View, Text, Image, and StyleSheet...</p>', duration: 30, xpReward: 85, pointsReward: 21, difficulty: 'intermediate' },
      { title: 'Navigation & State Management', course: courses[4]._id, order: 3, contentType: 'text', content: '<h2>App Architecture</h2><p>React Navigation and Context API...</p>', duration: 40, xpReward: 110, pointsReward: 27, difficulty: 'intermediate' },
      { title: 'Native Features & APIs', course: courses[4]._id, order: 4, contentType: 'text', content: '<h2>Device Integration</h2><p>Camera, location, notifications and more...</p>', duration: 45, xpReward: 140, pointsReward: 35, difficulty: 'advanced' },
      { title: 'Publishing to App Stores', course: courses[4]._id, order: 5, contentType: 'text', content: '<h2>Deployment</h2><p>Build and deploy to iOS App Store and Google Play...</p>', duration: 50, xpReward: 170, pointsReward: 42, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[4]._id, { modules: course4Lessons.map(l => l._id) });
    allLessons.push(...course4Lessons);

    // Course 5: Python for Data Science
    const course5Lessons = await Lesson.insertMany([
      { title: 'Python Fundamentals Review', course: courses[5]._id, order: 1, contentType: 'text', content: '<h2>Python Essentials</h2><p>Quick review of Python syntax and concepts...</p>', duration: 20, xpReward: 55, pointsReward: 14, difficulty: 'beginner' },
      { title: 'NumPy for Numerical Computing', course: courses[5]._id, order: 2, contentType: 'text', content: '<h2>Array Operations</h2><p>Master NumPy arrays and mathematical operations...</p>', duration: 30, xpReward: 75, pointsReward: 19, difficulty: 'intermediate' },
      { title: 'Pandas Data Manipulation', course: courses[5]._id, order: 3, contentType: 'text', content: '<h2>DataFrames</h2><p>Clean, transform, and analyze data with pandas...</p>', duration: 35, xpReward: 95, pointsReward: 24, difficulty: 'intermediate' },
      { title: 'Data Visualization with Matplotlib', course: courses[5]._id, order: 4, contentType: 'text', content: '<h2>Plotting Data</h2><p>Create stunning visualizations...</p>', duration: 30, xpReward: 80, pointsReward: 20, difficulty: 'intermediate' },
      { title: 'Real-World Data Analysis Project', course: courses[5]._id, order: 5, contentType: 'text', content: '<h2>Capstone Project</h2><p>Analyze a real dataset from start to finish...</p>', duration: 50, xpReward: 150, pointsReward: 37, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[5]._id, { modules: course5Lessons.map(l => l._id) });
    allLessons.push(...course5Lessons);

    // Course 6: Cloud Computing with AWS
    const course6Lessons = await Lesson.insertMany([
      { title: 'AWS Cloud Fundamentals', course: courses[6]._id, order: 1, contentType: 'text', content: '<h2>Introduction to AWS</h2><p>Understanding cloud computing and AWS services...</p>', duration: 30, xpReward: 90, pointsReward: 22, difficulty: 'intermediate' },
      { title: 'EC2 & Compute Services', course: courses[6]._id, order: 2, contentType: 'text', content: '<h2>Virtual Servers</h2><p>Launch and manage EC2 instances...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: 'S3 & Storage Solutions', course: courses[6]._id, order: 3, contentType: 'text', content: '<h2>Object Storage</h2><p>Store and retrieve data with S3...</p>', duration: 35, xpReward: 110, pointsReward: 27, difficulty: 'intermediate' },
      { title: 'Lambda & Serverless Architecture', course: courses[6]._id, order: 4, contentType: 'text', content: '<h2>Serverless Computing</h2><p>Build without managing servers...</p>', duration: 45, xpReward: 150, pointsReward: 37, difficulty: 'advanced' },
      { title: 'AWS Security & Best Practices', course: courses[6]._id, order: 5, contentType: 'text', content: '<h2>Cloud Security</h2><p>IAM, VPC, and security implementation...</p>', duration: 50, xpReward: 180, pointsReward: 45, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[6]._id, { modules: course6Lessons.map(l => l._id) });
    allLessons.push(...course6Lessons);

    // Course 7: Cybersecurity Essentials
    const course7Lessons = await Lesson.insertMany([
      { title: 'Security Fundamentals', course: courses[7]._id, order: 1, contentType: 'text', content: '<h2>CIA Triad</h2><p>Confidentiality, Integrity, and Availability...</p>', duration: 25, xpReward: 70, pointsReward: 17, difficulty: 'beginner' },
      { title: 'Network Security Basics', course: courses[7]._id, order: 2, contentType: 'text', content: '<h2>Securing Networks</h2><p>Firewalls, VPNs, and network protocols...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: 'Cryptography & Encryption', course: courses[7]._id, order: 3, contentType: 'text', content: '<h2>Protecting Data</h2><p>Symmetric, asymmetric encryption and hashing...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: 'Ethical Hacking Techniques', course: courses[7]._id, order: 4, contentType: 'text', content: '<h2>Penetration Testing</h2><p>Learn to think like a hacker...</p>', duration: 45, xpReward: 140, pointsReward: 35, difficulty: 'advanced' },
      { title: 'Incident Response & Recovery', course: courses[7]._id, order: 5, contentType: 'text', content: '<h2>Handling Breaches</h2><p>Respond to and recover from security incidents...</p>', duration: 40, xpReward: 130, pointsReward: 32, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[7]._id, { modules: course7Lessons.map(l => l._id) });
    allLessons.push(...course7Lessons);

    // Course 8: Full-Stack JavaScript
    const course8Lessons = await Lesson.insertMany([
      { title: 'MERN Stack Overview', course: courses[8]._id, order: 1, contentType: 'text', content: '<h2>Full-Stack Architecture</h2><p>Understanding the MERN stack ecosystem...</p>', duration: 25, xpReward: 75, pointsReward: 18, difficulty: 'intermediate' },
      { title: 'MongoDB & Database Design', course: courses[8]._id, order: 2, contentType: 'text', content: '<h2>NoSQL Databases</h2><p>Schema design and CRUD operations...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: 'Express.js REST APIs', course: courses[8]._id, order: 3, contentType: 'text', content: '<h2>Backend Development</h2><p>Build RESTful APIs with Express...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: 'React Frontend Integration', course: courses[8]._id, order: 4, contentType: 'text', content: '<h2>Connecting Frontend</h2><p>State management and API integration...</p>', duration: 45, xpReward: 140, pointsReward: 35, difficulty: 'advanced' },
      { title: 'Authentication & Deployment', course: courses[8]._id, order: 5, contentType: 'text', content: '<h2>Production Ready</h2><p>JWT auth and cloud deployment...</p>', duration: 50, xpReward: 165, pointsReward: 41, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[8]._id, { modules: course8Lessons.map(l => l._id) });
    allLessons.push(...course8Lessons);

    // Course 9: Digital Marketing Masterclass
    const course9Lessons = await Lesson.insertMany([
      { title: 'Digital Marketing Foundations', course: courses[9]._id, order: 1, contentType: 'text', content: '<h2>Marketing Basics</h2><p>Core concepts and strategies...</p>', duration: 20, xpReward: 50, pointsReward: 12, difficulty: 'beginner' },
      { title: 'SEO & Content Strategy', course: courses[9]._id, order: 2, contentType: 'text', content: '<h2>Search Optimization</h2><p>Rank higher on Google...</p>', duration: 30, xpReward: 75, pointsReward: 18, difficulty: 'intermediate' },
      { title: 'Social Media Marketing', course: courses[9]._id, order: 3, contentType: 'text', content: '<h2>Social Platforms</h2><p>Facebook, Instagram, LinkedIn strategies...</p>', duration: 35, xpReward: 90, pointsReward: 22, difficulty: 'intermediate' },
      { title: 'Google Analytics & Metrics', course: courses[9]._id, order: 4, contentType: 'text', content: '<h2>Data-Driven Marketing</h2><p>Track and analyze campaign performance...</p>', duration: 30, xpReward: 80, pointsReward: 20, difficulty: 'intermediate' },
    ]);
    await Course.findByIdAndUpdate(courses[9]._id, { modules: course9Lessons.map(l => l._id) });
    allLessons.push(...course9Lessons);

    // Course 10: Blockchain & Cryptocurrency
    const course10Lessons = await Lesson.insertMany([
      { title: 'Blockchain Technology Basics', course: courses[10]._id, order: 1, contentType: 'text', content: '<h2>What is Blockchain?</h2><p>Distributed ledger technology explained...</p>', duration: 30, xpReward: 90, pointsReward: 22, difficulty: 'intermediate' },
      { title: 'Cryptocurrency Fundamentals', course: courses[10]._id, order: 2, contentType: 'text', content: '<h2>Bitcoin & Ethereum</h2><p>Understanding digital currencies...</p>', duration: 35, xpReward: 105, pointsReward: 26, difficulty: 'intermediate' },
      { title: 'Smart Contracts with Solidity', course: courses[10]._id, order: 3, contentType: 'text', content: '<h2>Programming Blockchain</h2><p>Write smart contracts on Ethereum...</p>', duration: 45, xpReward: 140, pointsReward: 35, difficulty: 'advanced' },
      { title: 'DeFi & Web3 Applications', course: courses[10]._id, order: 4, contentType: 'text', content: '<h2>Decentralized Finance</h2><p>Build dApps and DeFi protocols...</p>', duration: 50, xpReward: 170, pointsReward: 42, difficulty: 'advanced' },
      { title: 'NFTs & Token Economics', course: courses[10]._id, order: 5, contentType: 'text', content: '<h2>Digital Assets</h2><p>Create and trade NFTs...</p>', duration: 40, xpReward: 130, pointsReward: 32, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[10]._id, { modules: course10Lessons.map(l => l._id) });
    allLessons.push(...course10Lessons);

    // Course 11: Deep Learning & Neural Networks
    const course11Lessons = await Lesson.insertMany([
      { title: 'Neural Network Architecture', course: courses[11]._id, order: 1, contentType: 'text', content: '<h2>Deep Learning Fundamentals</h2><p>Neurons, layers, and activation functions...</p>', duration: 35, xpReward: 110, pointsReward: 27, difficulty: 'intermediate' },
      { title: 'Convolutional Neural Networks', course: courses[11]._id, order: 2, contentType: 'text', content: '<h2>Computer Vision</h2><p>CNNs for image recognition...</p>', duration: 45, xpReward: 145, pointsReward: 36, difficulty: 'advanced' },
      { title: 'Recurrent Neural Networks', course: courses[11]._id, order: 3, contentType: 'text', content: '<h2>Sequence Models</h2><p>RNNs and LSTMs for time series...</p>', duration: 50, xpReward: 165, pointsReward: 41, difficulty: 'advanced' },
      { title: 'Generative Adversarial Networks', course: courses[11]._id, order: 4, contentType: 'text', content: '<h2>GANs</h2><p>Generate realistic images and data...</p>', duration: 55, xpReward: 185, pointsReward: 46, difficulty: 'advanced' },
      { title: 'Transformer Models & Attention', course: courses[11]._id, order: 5, contentType: 'text', content: '<h2>Modern NLP</h2><p>BERT, GPT, and attention mechanisms...</p>', duration: 60, xpReward: 200, pointsReward: 50, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[11]._id, { modules: course11Lessons.map(l => l._id) });
    allLessons.push(...course11Lessons);

    // Course 12: Graphic Design with Adobe Suite
    const course12Lessons = await Lesson.insertMany([
      { title: 'Adobe Creative Cloud Setup', course: courses[12]._id, order: 1, contentType: 'text', content: '<h2>Getting Started</h2><p>Install and navigate Adobe apps...</p>', duration: 20, xpReward: 55, pointsReward: 13, difficulty: 'beginner' },
      { title: 'Photoshop Essentials', course: courses[12]._id, order: 2, contentType: 'text', content: '<h2>Photo Editing</h2><p>Layers, masks, and retouching...</p>', duration: 35, xpReward: 95, pointsReward: 23, difficulty: 'intermediate' },
      { title: 'Illustrator Vector Graphics', course: courses[12]._id, order: 3, contentType: 'text', content: '<h2>Logo Design</h2><p>Create scalable vector artwork...</p>', duration: 40, xpReward: 115, pointsReward: 28, difficulty: 'intermediate' },
      { title: 'InDesign Layout Design', course: courses[12]._id, order: 4, contentType: 'text', content: '<h2>Print & Digital</h2><p>Design magazines and brochures...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: 'Portfolio Design Project', course: courses[12]._id, order: 5, contentType: 'text', content: '<h2>Showcase Your Work</h2><p>Create a professional portfolio...</p>', duration: 45, xpReward: 135, pointsReward: 33, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[12]._id, { modules: course12Lessons.map(l => l._id) });
    allLessons.push(...course12Lessons);

    // Course 13: iOS Development with Swift
    const course13Lessons = await Lesson.insertMany([
      { title: 'Swift Language Basics', course: courses[13]._id, order: 1, contentType: 'text', content: '<h2>Swift Programming</h2><p>Learn Swift syntax and fundamentals...</p>', duration: 30, xpReward: 80, pointsReward: 20, difficulty: 'intermediate' },
      { title: 'UIKit Fundamentals', course: courses[13]._id, order: 2, contentType: 'text', content: '<h2>Building UI</h2><p>Views, controllers, and storyboards...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: 'SwiftUI Modern Development', course: courses[13]._id, order: 3, contentType: 'text', content: '<h2>Declarative UI</h2><p>Build apps with SwiftUI...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: 'Core Data & Persistence', course: courses[13]._id, order: 4, contentType: 'text', content: '<h2>Data Storage</h2><p>Save and retrieve app data...</p>', duration: 45, xpReward: 140, pointsReward: 35, difficulty: 'advanced' },
      { title: 'App Store Submission', course: courses[13]._id, order: 5, contentType: 'text', content: '<h2>Publishing iOS Apps</h2><p>Submit to the App Store...</p>', duration: 40, xpReward: 130, pointsReward: 32, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[13]._id, { modules: course13Lessons.map(l => l._id) });
    allLessons.push(...course13Lessons);

    // Course 14: DevOps Engineering
    const course14Lessons = await Lesson.insertMany([
      { title: 'DevOps Culture & Principles', course: courses[14]._id, order: 1, contentType: 'text', content: '<h2>DevOps Mindset</h2><p>Collaboration, automation, and CI/CD...</p>', duration: 25, xpReward: 75, pointsReward: 18, difficulty: 'intermediate' },
      { title: 'Docker Containerization', course: courses[14]._id, order: 2, contentType: 'text', content: '<h2>Containers</h2><p>Build and manage Docker containers...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: 'Kubernetes Orchestration', course: courses[14]._id, order: 3, contentType: 'text', content: '<h2>Container Orchestration</h2><p>Deploy and scale with Kubernetes...</p>', duration: 50, xpReward: 160, pointsReward: 40, difficulty: 'advanced' },
      { title: 'CI/CD with Jenkins', course: courses[14]._id, order: 4, contentType: 'text', content: '<h2>Automation Pipelines</h2><p>Automate testing and deployment...</p>', duration: 45, xpReward: 145, pointsReward: 36, difficulty: 'advanced' },
      { title: 'Infrastructure as Code', course: courses[14]._id, order: 5, contentType: 'text', content: '<h2>Terraform & Ansible</h2><p>Manage infrastructure with code...</p>', duration: 50, xpReward: 170, pointsReward: 42, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[14]._id, { modules: course14Lessons.map(l => l._id) });
    allLessons.push(...course14Lessons);

    // Course 15: Game Development with Unity
    const course15Lessons = await Lesson.insertMany([
      { title: 'Unity Interface & Basics', course: courses[15]._id, order: 1, contentType: 'text', content: '<h2>Getting Started</h2><p>Navigate the Unity editor...</p>', duration: 25, xpReward: 70, pointsReward: 17, difficulty: 'beginner' },
      { title: 'C# Scripting for Unity', course: courses[15]._id, order: 2, contentType: 'text', content: '<h2>Game Programming</h2><p>Learn C# for game development...</p>', duration: 35, xpReward: 100, pointsReward: 25, difficulty: 'intermediate' },
      { title: '2D Game Development', course: courses[15]._id, order: 3, contentType: 'text', content: '<h2>2D Platformer</h2><p>Create your first 2D game...</p>', duration: 40, xpReward: 120, pointsReward: 30, difficulty: 'intermediate' },
      { title: '3D Game Mechanics', course: courses[15]._id, order: 4, contentType: 'text', content: '<h2>3D World Building</h2><p>Physics, lighting, and animation...</p>', duration: 50, xpReward: 150, pointsReward: 37, difficulty: 'advanced' },
      { title: 'Publishing Your Game', course: courses[15]._id, order: 5, contentType: 'text', content: '<h2>Game Release</h2><p>Build and publish to platforms...</p>', duration: 40, xpReward: 130, pointsReward: 32, difficulty: 'advanced' },
    ]);
    await Course.findByIdAndUpdate(courses[15]._id, { modules: course15Lessons.map(l => l._id) });
    allLessons.push(...course15Lessons);

    console.log(`✅ Seeded ${allLessons.length} modules across ${courses.length} courses`);

    // Seed quizzes
    await Quiz.insertMany([
      {
        title: 'HTML Fundamentals Quiz',
        description: 'Test your knowledge of HTML basics',
        course: courses[0]._id,
        lesson: course0Lessons[0]._id,
        difficulty: 'beginner',
        xpReward: 100,
        pointsReward: 25,
        timeLimit: 10,
        passingScore: 70,
        questions: [
          { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Tabular Math Language', 'None'], correctAnswer: 0, explanation: 'HTML stands for HyperText Markup Language', points: 10 },
          { question: 'Which tag creates a hyperlink in HTML?', options: ['<link>', '<href>', '<a>', '<url>'], correctAnswer: 2, explanation: 'The <a> (anchor) tag creates hyperlinks', points: 10 },
          { question: 'Which HTML tag is used for the largest heading?', options: ['<h6>', '<h1>', '<head>', '<heading>'], correctAnswer: 1, explanation: '<h1> represents the largest/most important heading', points: 10 },
          { question: 'What is the correct HTML for inserting an image?', options: ['<img href="img.png">', '<image src="img.png">', '<img src="img.png">', '<img source="img.png">'], correctAnswer: 2, explanation: '<img src="..."> is the correct syntax', points: 10 },
          { question: 'Which tag creates an unordered list?', options: ['<ol>', '<list>', '<ul>', '<li>'], correctAnswer: 2, explanation: '<ul> creates an unordered (bullet) list', points: 10 },
        ],
      },
      {
        title: 'JavaScript Basics Quiz',
        course: courses[0]._id,
        lesson: course0Lessons[2]._id,
        difficulty: 'intermediate',
        xpReward: 150,
        pointsReward: 40,
        timeLimit: 15,
        passingScore: 60,
        questions: [
          { question: 'Which keyword declares a block-scoped variable in JavaScript?', options: ['var', 'let', 'define', 'scope'], correctAnswer: 1, explanation: '"let" is block-scoped, unlike "var"', points: 15 },
          { question: 'What is the output of: typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctAnswer: 2, explanation: 'typeof null returns "object" - a known JS quirk', points: 15 },
          { question: 'Which method removes the last element from an array?', options: ['pop()', 'push()', 'shift()', 'unshift()'], correctAnswer: 0, explanation: 'Array.pop() removes and returns the last element', points: 15 },
          { question: 'What does the === operator do?', options: ['Compares values loosely', 'Compares values and types strictly', 'Assigns a value', 'Multiplies numbers'], correctAnswer: 1, explanation: '=== checks for both value and type equality', points: 15 },
          { question: 'Which is the correct way to write a function in JavaScript?', options: ['function = myFunc() {}', 'function myFunc() {}', 'func myFunc() {}', 'def myFunc() {}'], correctAnswer: 1, explanation: 'function myFunc() {} is the correct syntax', points: 15 },
        ],
      },
      {
        title: 'React Fundamentals Quiz',
        course: courses[0]._id,
        lesson: course0Lessons[3]._id,
        difficulty: 'intermediate',
        xpReward: 200,
        pointsReward: 50,
        timeLimit: 15,
        passingScore: 65,
        questions: [
          { question: 'What is JSX?', options: ['Java Syntax Extension', 'JavaScript XML', 'JavaScript Extra', 'Just Something eXtended'], correctAnswer: 1, explanation: 'JSX allows you to write HTML-like syntax in JavaScript', points: 20 },
          { question: 'How do you pass data from parent to child in React?', options: ['Using state', 'Using props', 'Using context', 'Using refs'], correctAnswer: 1, explanation: 'Props are used to pass data from parent to child components', points: 20 },
          { question: 'What hook manages local state in functional components?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctAnswer: 1, explanation: 'useState hook allows you to add state to functional components', points: 20 },
          { question: 'When does useEffect run?', options: ['Only once on mount', 'After every render', 'Only on state change', 'It depends on the dependency array'], correctAnswer: 3, explanation: 'useEffect behavior depends on the dependency array provided', points: 20 },
        ],
      },
      {
        title: 'CSS & Styling Quiz',
        course: courses[0]._id,
        lesson: course0Lessons[1]._id,
        difficulty: 'beginner',
        xpReward: 120,
        pointsReward: 30,
        timeLimit: 12,
        passingScore: 70,
        questions: [
          { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'none'], correctAnswer: 1, explanation: 'CSS = Cascading Style Sheets', points: 10 },
          { question: 'Which selector targets all elements with a specific class?', options: ['.className', '#className', '*className', '+className'], correctAnswer: 0, explanation: 'The dot (.) selector targets classes', points: 10 },
          { question: 'What is the correct CSS syntax for changing text color?', options: ['textcolor: red', 'color: red', 'text-color: red', 'font-color: red'], correctAnswer: 1, explanation: 'The color property changes text color', points: 10 },
          { question: 'Which CSS property controls spacing outside an element?', options: ['padding', 'margin', 'border', 'gap'], correctAnswer: 1, explanation: 'Margin creates space outside an element', points: 10 },
          { question: 'What does flexbox help with?', options: ['Organizing colors', 'Layout and alignment', 'Font styling', 'Animation'], correctAnswer: 1, explanation: 'Flexbox is used for flexible box layouts', points: 10 },
        ],
      },
      {
        title: 'Data Structures Basics Quiz',
        course: courses[2]._id,
        lesson: null,
        difficulty: 'intermediate',
        xpReward: 180,
        pointsReward: 45,
        timeLimit: 15,
        passingScore: 65,
        questions: [
          { question: 'What is the time complexity of searching in an unsorted array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, explanation: 'Unsorted arrays require linear search O(n)', points: 20 },
          { question: 'Which data structure works on LIFO principle?', options: ['Queue', 'Stack', 'Array', 'LinkedList'], correctAnswer: 1, explanation: 'Stack follows Last In First Out (LIFO)', points: 20 },
          { question: 'What is the space complexity of a binary search tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, explanation: 'BST space complexity is O(n) for n nodes', points: 20 },
          { question: 'Which sorting algorithm has the best average case?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], correctAnswer: 2, explanation: 'Merge Sort has O(n log n) average case', points: 20 },
        ],
      },
      {
        title: 'Machine Learning Concepts Quiz',
        course: courses[1]._id,
        lesson: null,
        difficulty: 'advanced',
        xpReward: 250,
        pointsReward: 60,
        timeLimit: 20,
        passingScore: 70,
        questions: [
          { question: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Learning from mistakes', 'Learning from features only'], correctAnswer: 1, explanation: 'Supervised learning uses labeled training data', points: 25 },
          { question: 'What does overfitting mean?', options: ['Model fits training data too well', 'Model is too simple', 'Model learns general patterns', 'Model needs more data'], correctAnswer: 0, explanation: 'Overfitting occurs when a model memorizes training data too well', points: 25 },
          { question: 'Which is NOT a supervised learning algorithm?', options: ['Linear Regression', 'K-Means', 'SVM', 'Decision Tree'], correctAnswer: 1, explanation: 'K-Means is an unsupervised clustering algorithm', points: 25 },
          { question: 'What does cross-validation help prevent?', options: ['Underfitting', 'Overfitting', 'Data leakage', 'Overfitting and improper model evaluation'], correctAnswer: 3, explanation: 'Cross-validation prevents overfitting and ensures reliable evaluation', points: 25 },
        ],
      },
    ]);
    console.log('✅ Seeded quizzes');

    // Assign earned badges to top students
    const earnedBadges = [badges[0], badges[1]];
    await User.findByIdAndUpdate(students[4]._id, { badges: badges.map(b => b._id) });
    await User.findByIdAndUpdate(students[2]._id, { badges: [badges[0]._id, badges[1]._id, badges[2]._id, badges[3]._id] });
    await User.findByIdAndUpdate(students[0]._id, { badges: [badges[0]._id, badges[1]._id, badges[2]._id] });

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('   Admin:    admin@glearnplatform.com     / admin123');
    console.log('   Educator: educator@glearnplatform.com  / educator123');
    console.log('   Student:  alex@example.com         / student123');
    console.log('   Student:  sam@example.com          / student123 (Top Ranked)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
